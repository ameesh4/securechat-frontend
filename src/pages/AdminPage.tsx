import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Search,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Activity,
  UserPlus,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useUserStore } from "../store/userStore";
import React from "react";

const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    lastActive: "2 min ago",
    messagesCount: 245,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    status: "active",
    lastActive: "5 min ago",
    messagesCount: 189,
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    status: "inactive",
    lastActive: "2 hours ago",
    messagesCount: 412,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    status: "active",
    lastActive: "1 min ago",
    messagesCount: 78,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    status: "suspended",
    lastActive: "1 day ago",
    messagesCount: 56,
  },
];

const mockReports = [
  {
    id: "1",
    type: "Spam",
    reporter: "John Doe",
    reported: "Jane Smith",
    timestamp: "10 min ago",
    status: "pending",
  },
  {
    id: "2",
    type: "Harassment",
    reporter: "Alice Brown",
    reported: "Bob Wilson",
    timestamp: "1 hour ago",
    status: "reviewing",
  },
  {
    id: "3",
    type: "Inappropriate Content",
    reporter: "Carol Davis",
    reported: "Dave Miller",
    timestamp: "2 hours ago",
    status: "resolved",
  },
];

export function AdminPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const switchToChat = useUserStore((state) => state.switchToChat);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchToChat = () => {
    switchToChat();
    navigate("/chat");
  };

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1>Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSwitchToChat}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?w=150" />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">2,543</div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Conversations</CardTitle>
              <MessageCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1,234</div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Messages Today</CardTitle>
              <Activity className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">45,231</div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-red-600">-3.1%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Reports</CardTitle>
              <AlertCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">12</div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <span className="text-orange-600">3 high priority</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports">
              <AlertCircle className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage and monitor all users in the system
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{u.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{u.name}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "active"
                                ? "default"
                                : u.status === "inactive"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {u.lastActive}
                        </TableCell>
                        <TableCell>{u.messagesCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-orange-600">
                                Suspend Account
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    Monthly user registration trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Message Activity</CardTitle>
                  <CardDescription>Daily message volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Most active times of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>Active vs inactive users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>
                  Review and manage reported content and users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reported}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {report.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "pending"
                                ? "secondary"
                                : report.status === "reviewing"
                                ? "default"
                                : "outline"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure application-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Enable User Registration</p>
                      <p className="text-sm text-gray-500">
                        Allow new users to sign up
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Message Moderation</p>
                      <p className="text-sm text-gray-500">
                        Automatically flag inappropriate content
                      </p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Send email alerts to users
                      </p>
                    </div>
                    <Button variant="outline">Disabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Data Retention</p>
                      <p className="text-sm text-gray-500">
                        Days to keep deleted messages
                      </p>
                    </div>
                    <Input type="number" defaultValue="30" className="w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
