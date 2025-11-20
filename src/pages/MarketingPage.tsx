import { Mail, Zap, Filter, Bot, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
const features = [
  {
    icon: Zap,
    title: "Automation Workflows",
    description: "Build powerful automations to nurture leads and manage customers on autopilot.",
    link: "/marketing/automations",
    enabled: true,
  },
  {
    icon: Mail,
    title: "Email Campaigns",
    description: "Design, send, and track beautiful email campaigns to engage your audience.",
    link: "/marketing/email-campaigns",
    enabled: true,
  },
  {
    icon: Filter,
    title: "Funnel Builder",
    description: "Create high-converting sales and marketing funnels with a visual drag-and-drop editor.",
    link: "/marketing/funnels",
    enabled: true,
  },
  {
    icon: Bot,
    title: "AI-Powered Tools",
    description: "Leverage AI for content generation, lead scoring, and predictive analytics.",
    link: "#",
    enabled: false,
  },
];
export function MarketingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          All-in-One Marketing Suite
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to attract, engage, and convert customers.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={cn(
              "transition-all duration-200 group",
              feature.enabled
                ? "hover:shadow-lg hover:-translate-y-1"
                : "bg-muted/50 cursor-not-allowed"
            )}
          >
            <Link to={feature.enabled ? feature.link : '#'} className={cn(!feature.enabled && "pointer-events-none")}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-full", feature.enabled ? "bg-primary/10" : "bg-muted-foreground/10")}>
                    <feature.icon className={cn("h-6 w-6", feature.enabled ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                {feature.enabled && <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
                {!feature.enabled && (
                  <p className="text-sm font-semibold text-primary mt-2">Coming Soon</p>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}