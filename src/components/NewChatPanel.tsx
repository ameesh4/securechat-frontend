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
import { base64ToBigint, bigintToBase64, ExportAESKey, GetAESKey, RSAEncrypt } from "@/utils/AES";
import type { Response } from "@/utils/Response";
type ChatSessionRequestResponse = {
  user1_public_key: string;
  user2_public_key: string;
}


export default function NewChatPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const onSubmit = async (email: string) => {

    if (loading) return;
    setLoading(true);
    const res = await axiosInstance.post<Response<ChatSessionRequestResponse>>("/chat-session/request", { email })

    if (res.data.success === false) {
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

    const res_create = await axiosInstance.post("/chat-session/create", {
      email,
      a1: encrypted_AES_key_for_me_b64,
      a2: encrypted_AES_key_for_other_b64,
    })

    if (res_create.data.success === false) {
      setLoading(false);
      alert(res_create.data.error || "Failed to create chat session");
      return;
    }

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
          }}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
            <Button type="submit" variant="outline">Start</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
