import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  X, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Camera,
  Save,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsPanelProps {
  user: { id: string; name: string; email: string; role: 'user' | 'admin' };
  onClose: () => void;
}

export function SettingsPanel({ user, onClose }: SettingsPanelProps) {
  // Account settings
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState('Software developer passionate about creating great user experiences.');
  const [phone, setPhone] = useState('+1 (555) 123-4567');

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [lastSeenVisibility, setLastSeenVisibility] = useState('contacts');
  const [readReceipts, setReadReceipts] = useState(true);
  const [typing, setTyping] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Appearance settings
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);

  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveAccount = () => {
    alert('Account settings saved successfully!');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2>Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="account" className="gap-2">
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Lock className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?w=150" />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <p>Profile Picture</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Upload</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAccount}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your information and activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Profile Visibility</p>
                        <p className="text-sm text-gray-500">Who can see your profile</p>
                      </div>
                      <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="contacts">My Contacts</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Last Seen</p>
                        <p className="text-sm text-gray-500">Who can see when you were last online</p>
                      </div>
                      <Select value={lastSeenVisibility} onValueChange={setLastSeenVisibility}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="contacts">My Contacts</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Read Receipts</p>
                        <p className="text-sm text-gray-500">Let others know when you've read their messages</p>
                      </div>
                      <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Typing Indicator</p>
                        <p className="text-sm text-gray-500">Show when you're typing a message</p>
                      </div>
                      <Switch checked={typing} onCheckedChange={setTyping} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Message Notifications</p>
                        <p className="text-sm text-gray-500">Get notified for new messages</p>
                      </div>
                      <Switch checked={messageNotifications} onCheckedChange={setMessageNotifications} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Notification Sound</p>
                        <p className="text-sm text-gray-500">Play sound for notifications</p>
                      </div>
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Theme</p>
                        <p className="text-sm text-gray-500">Choose your preferred color theme</p>
                      </div>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Font Size</p>
                        <p className="text-sm text-gray-500">Adjust text size</p>
                      </div>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Compact Mode</p>
                        <p className="text-sm text-gray-500">Display more content in less space</p>
                      </div>
                      <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Enable 2FA</p>
                      <p className="text-sm text-gray-500">
                        {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Protect your account with 2FA'}
                      </p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
