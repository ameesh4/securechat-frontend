import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { AESDecrypt, base64ToBigint, bigintToBase64, ExportAESKey, GetAESKey, ImportAESKey, RSADecrypt, RSAEncrypt } from "@/utils/AES";
import type { Response } from "@/utils/Response";
import type { Conversation } from "@/components/ChatInterface";


type ChatSessionRequestResponse = {
  user1_public_key: string;
  user2_public_key: string;
}

export type GoUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  refresh_token: string;
  is_admin: boolean;
  public_key: string;
  created_at: number;
  updated_at: number;
}

export type GoChatSession = {
  id: number;
  participant1: string;
  participant2: string;
  created_at: number;
  updated_at: number;

  a1: string;
  a2: string;

  User1: GoUser;
  User2: GoUser;
}


export async function decryptAESKey(encB64aes: string){
  const my_private_key_base_64 = sessionStorage.getItem("private_key") || localStorage.getItem("private_key");
  if (!my_private_key_base_64) {
    throw new Error("FATAL ERROR: Private key not found");
  }
  const my_public_key_base_64 = sessionStorage.getItem("public_key") || localStorage.getItem("public_key");
  if (!my_public_key_base_64) {
    throw new Error("FATAL ERROR: Public key not found");
  }
  
  const my_private_key = base64ToBigint(my_private_key_base_64);
  const my_public_key = base64ToBigint(my_public_key_base_64);
  const aes_key_enc = base64ToBigint(encB64aes);

  const my_exported_aes_key =  RSADecrypt(aes_key_enc, {
    n: my_public_key,
    d: my_private_key,
  });
  return await ImportAESKey(my_exported_aes_key);
}


export default function NewChatPanel({
  open,
  onOpenChange,
  addConversation
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addConversation: (conversation: Conversation) => void;
}) {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const onSubmit = async (email: string) => {

    if (loading) return;
    setLoading(true);
    const res = await axiosInstance.post<Response<ChatSessionRequestResponse>>("/chat-session/request", { email })

    if (res.data.status === false) {
      setLoading(false);
      alert(res.data.error || "Failed to create chat session");
      return;
    }

    const data = res.data.data

    const my_public_key_str = data.user1_public_key;
    const my_public_key = base64ToBigint(my_public_key_str);

    const e = 65537n;

    const other_public_key_str = data.user2_public_key;
    const other_public_key = base64ToBigint(other_public_key_str);

    const AES_key = await GetAESKey();
    const exported_AES_key = await ExportAESKey(AES_key.key);

    const encrypted_AES_key_for_me = RSAEncrypt(exported_AES_key, {
      e: e,
      n: my_public_key,
    });

    const encrypted_AES_key_for_other = RSAEncrypt(exported_AES_key, {
      e: e,
      n: other_public_key,
    });


    const encrypted_AES_key_for_me_b64 = bigintToBase64(encrypted_AES_key_for_me);
    const encrypted_AES_key_for_other_b64 = bigintToBase64(encrypted_AES_key_for_other);

    const res_create = await axiosInstance.post<Response<GoChatSession>>("/chat-session/create", {
      email,
      a1: encrypted_AES_key_for_me_b64,
      a2: encrypted_AES_key_for_other_b64,
    })

    if (res_create.data.status === false) {
      setLoading(false);
      alert(res_create.data.error || "Failed to create chat session");
      return;
    }

    const chat_session =  res_create.data.data;


    const aes_key = await decryptAESKey(chat_session.a1);

    const newConversation: Conversation = {
      id: chat_session.id,
      user_id: chat_session.User2.id,
      name: chat_session.User2.name,
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      unread:0,
      isGroup: false,
      avatar: "",
      isOnline: false,
      aes_key: {
        key: aes_key
      }
    };

    addConversation(newConversation);

    setLoading(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={() => {
        if (loading) return;
        onOpenChange(false);
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
          </DialogHeader>
          <form 
          className="flex flex-col items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(email)
            onOpenChange(false);
          }}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Button type="submit" variant="outline">Start</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
