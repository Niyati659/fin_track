import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, PiggyBank, Bot, BarChart3, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: TrendingDown,
      title: "Expense Tracking",
      description: "Automatically categorize and track all your expenses with smart insights and spending patterns.",
      color: "text-red-600",
    },
    {
      icon: PiggyBank,
      title: "Savings Goals",
      description: "Set and achieve your savings goals with personalized recommendations and progress tracking.",
      color: "text-blue-600",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get personalized financial advice and insights powered by advanced AI to optimize your finances.",
      color: "text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Visualize your financial data with comprehensive charts and detailed monthly reports.",
      color: "text-green-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security with end-to-end encryption to keep your financial data safe and private.",
      color: "text-orange-600",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to take control of your finances and build a better financial future
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4 mb-2">
                  <div className={`p-2 rounded-lg bg-background shadow-sm`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold leading-tight">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
