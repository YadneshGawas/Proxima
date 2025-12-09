import { useNavigate } from "react-router-dom";
import { Zap, Users, Trophy, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import TubesCursorBackground from "@/components/TubesMotion";
import DecryptedText from "@/components/DecryptedText";
import TextType from "@/components/TextType";

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Discover Hackathons",
      description:
        "Find hackathons near you or online, filtered by your interests and skills.",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Track Your Progress",
      description:
        "Monitor your wins, participation history, and grow your competitive profile.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description:
        "Get insights into your performance with detailed analytics and visualizations.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background isolate">
      {/* Tubes Background */}
      <TubesCursorBackground />

      {/* Header */}
      <header className="fixed top-0 w-full bg-transparent z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold text-foreground">
              {/* {" "} */}
              {/* <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={true}
                className="custom-class"
              >
                Proxima
              </GlitchText> */}
              <DecryptedText speed={90} animateOn="both" text="Proxima" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button> */}
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Centered Hero Section */}
      <section className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Gateway to{" "}
            <span className="text-primary block">
              <DecryptedText speed={80} text="Hackathon" animateOn="view" />{" "}
              Success
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            Discover hackathons and track your journey as you grow into {""}
            <TextType
              text={[
                "a creator",
                "an innovator",
                "a leader",
                "a champion",
                "a problem solver",
              ]}
              typingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="_"
            />
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Sign In to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
