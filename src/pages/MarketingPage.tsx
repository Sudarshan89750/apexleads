import { Mail, Zap, Filter, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const features = [
  {
    icon: Mail,
    title: "Email Campaigns",
    description: "Design, send, and track beautiful email campaigns to engage your audience.",
  },
  {
    icon: Zap,
    title: "Automation Workflows",
    description: "Build powerful automations to nurture leads and manage customers on autopilot.",
  },
  {
    icon: Filter,
    title: "Funnel Builder",
    description: "Create high-converting sales and marketing funnels with a visual drag-and-drop editor.",
  },
  {
    icon: Bot,
    title: "AI-Powered Tools",
    description: "Leverage AI for content generation, lead scoring, and predictive analytics.",
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
          Everything you need to attract, engage, and convert customers is coming soon.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}