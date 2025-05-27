"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import type { Form, FormResponse } from "@/lib/types"

interface FormAnalyticsProps {
  form: Form
  responses: FormResponse[]
}

export function FormAnalytics({ form, responses }: FormAnalyticsProps) {
  // Calculate analytics data
  const totalResponses = responses.length
  const completionRate =
    form.fields.length > 0
      ? (responses.filter((r) => form.fields.every((f) => r.data[f.id])).length / totalResponses) * 100
      : 0

  // Field completion rates
  const fieldAnalytics = form.fields.map((field) => {
    const completedCount = responses.filter((r) => r.data[field.id]).length
    return {
      name: field.label,
      completed: completedCount,
      rate: totalResponses > 0 ? (completedCount / totalResponses) * 100 : 0,
      type: field.type,
    }
  })

  // Response timeline (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const timelineData = last7Days.map((date) => {
    const count = responses.filter((r) => new Date(r.submittedAt).toISOString().split("T")[0] === date).length
    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      responses: count,
    }
  })

  // Field type distribution
  const fieldTypeData = form.fields.reduce(
    (acc, field) => {
      acc[field.type] = (acc[field.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(fieldTypeData).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                <p className="text-2xl font-bold">{totalResponses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fields</p>
                <p className="text-2xl font-bold">{form.fields.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold">2.5m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Response Timeline (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Field Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Field Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Field Completion Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Field Completion Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fieldAnalytics.map((field, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{field.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {field.completed}/{totalResponses} ({field.rate.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={field.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
