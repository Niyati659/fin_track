import { Construction, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdvisoryHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="h-16 w-16 text-primary" />
              <div className="absolute -top-2 -right-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  In Progress
                </Badge>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">Advisory Hub</h1>

          <p className="text-xl text-muted-foreground mb-8">This feature is currently in production</p>

          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Coming Soon
              </CardTitle>
              <CardDescription>
                We're working hard to bring you personalized financial advice and investment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">AI-powered investment suggestions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Personalized financial planning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Risk assessment and portfolio optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Market insights and trends analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mt-6">Stay tuned for updates on this exciting new feature!</p>
        </div>
      </div>
    </div>
  )
}
