import {
  Home,
  Calendar,
  BarChart3,
  Mail,
  LogOut,
  Zap,
  Users,
  Coins,
  Rocket,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Hackathons", url: "/hackathons", icon: Calendar },
  { title: "Teams", url: "/teams", icon: Users },
  { title: "Credits", url: "/credits", icon: Coins },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Contact Us", url: "/contact", icon: Mail },
  { title: "Project Explorer", url: "/projects", icon: Rocket },
];

export function UserSidebar() {
  const { state } = useSidebar();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

const handleRoleCTA = () => {
  navigate("/admin/create-event");
};

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 p-4">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo-4.png"
            alt="logo"
            className="h-8 w-8 object-contain"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ROLE CTA */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Button
              variant="outline"
              className={`w-full ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              onClick={handleRoleCTA}
            >
              {collapsed ? (
                <Zap className="h-5 w-5" />
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Organizer Dashboard
                </>
              )}
            </Button>

            
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign Out">
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
