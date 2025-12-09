import { Home, Calendar, BarChart3, Mail, LogOut, Zap, Users, Coins } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Hackathons', url: '/hackathons', icon: Calendar },
  { title: 'Teams', url: '/teams', icon: Users },
  { title: 'Credits', url: '/credits', icon: Coins },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Contact Us', url: '/contact', icon: Mail },
];

export function UserSidebar() {
  const { state } = useSidebar();
  const { logout, user, becomeOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBecomeOrganizer = async () => {
    await becomeOrganizer();
    navigate('/admin');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">HackHub</span>
          )}
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

        {user?.role === 'user' && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className={collapsed ? 'px-2' : 'px-3'}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleBecomeOrganizer}
                >
                  {collapsed ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Become Organizer
                    </>
                  )}
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
