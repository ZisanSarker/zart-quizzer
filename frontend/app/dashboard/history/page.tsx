"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/dashboard-layout";
import { Brain, Calendar, Clock, Search, Trophy } from "lucide-react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/animations/motion";
import { getRecentQuizAttempts } from "@/lib/quiz";
import type { RecentQuizAttempt } from "@/types/quiz";

// Helper to format seconds into "Xh Ym Zs"
function formatTimeTaken(time: number | string | "N/A") {
  if (typeof time === "number" && !isNaN(time)) {
    if (time <= 0) return "N/A";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return [h ? `${h}h` : null, m ? `${m}m` : null, s ? `${s}s` : null]
      .filter(Boolean)
      .join(" ");
  }
  if (typeof time === "string" && time !== "N/A") {
    // fallback: if comes as "00:00" or similar, just show as is
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) return time;
  }
  return "N/A";
}

// Helper: get score badge color
const getScoreBadgeColor = (score: number) => {
  if (score >= 90) return "bg-green-500 hover:bg-green-600";
  if (score >= 70) return "bg-primary hover:bg-primary/90";
  if (score >= 50) return "bg-yellow-500 hover:bg-yellow-600";
  return "bg-red-500 hover:bg-red-600";
};

// Helper: relative date string
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState<RecentQuizAttempt[]>([]);

  // Derived: performance by topic, achievements
  const performanceByTopic = (() => {
    const topicMap: Record<string, { attempts: number; totalScore: number }> =
      {};
    quizHistory.forEach((item) => {
      const topic = item.quizTitle || "Unknown";
      if (!topicMap[topic]) topicMap[topic] = { attempts: 0, totalScore: 0 };
      topicMap[topic].attempts += 1;
      topicMap[topic].totalScore += Number(item.score) || 0;
    });
    return Object.entries(topicMap).map(
      ([topic, { attempts, totalScore }]) => ({
        topic,
        attempts,
        averageScore: attempts ? Math.round(totalScore / attempts) : 0,
      })
    );
  })();

  const achievements = (() => {
    // Example dynamic achievements based on history
    const list: {
      id: string;
      title: string;
      description: string;
      date: string;
    }[] = [];
    // Perfect Score
    const perfect = quizHistory.find((q) => q.score === 100);
    if (perfect)
      list.push({
        id: "perfect",
        title: "Perfect Score",
        description: `Achieved 100% on "${perfect.quizTitle}"`,
        date: perfect.completedAt,
      });
    // Completed 10 quizzes
    if (quizHistory.length >= 10) {
      list.push({
        id: "quizmaster",
        title: "Quiz Master",
        description: "Completed 10 quizzes",
        date:
          quizHistory[9]?.completedAt ||
          quizHistory[quizHistory.length - 1]?.completedAt,
      });
    }
    // Improved score (very simple logic: any later attempt with higher score for same quizId)
    let improvement: {
      title: string;
      prev: RecentQuizAttempt;
      curr: RecentQuizAttempt;
    } | null = null;
    const quizMap: Record<string, RecentQuizAttempt[]> = {};
    quizHistory.forEach((q) => {
      if (!quizMap[q.quizId]) quizMap[q.quizId] = [];
      quizMap[q.quizId].push(q);
    });
    for (const attempts of Object.values(quizMap)) {
      if (attempts.length > 1) {
        const sorted = [...attempts].sort(
          (a, b) =>
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
        );
        for (let i = 1; i < sorted.length; ++i) {
          if (sorted[i].score > sorted[i - 1].score) {
            improvement = {
              title: sorted[i].quizTitle,
              prev: sorted[i - 1],
              curr: sorted[i],
            };
            break;
          }
        }
      }
      if (improvement) break;
    }
    if (improvement) {
      list.push({
        id: "improve",
        title: "Fast Learner",
        description: `Improved score on "${improvement.title}" from ${improvement.prev.score}% to ${improvement.curr.score}%`,
        date: improvement.curr.completedAt,
      });
    }
    return list;
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecentQuizAttempts();
        setQuizHistory(data);
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredHistory = quizHistory.filter((item) =>
    item.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">
          Quiz History
        </h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quiz history..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Quizzes Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{quizHistory.length}</div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(() => {
                const validScores = quizHistory
                  .map((item) => Number(item.score))
                  .filter(
                    (score) => !isNaN(score) && score >= 0 && score <= 100
                  );
                return validScores.length > 0
                  ? Math.round(
                      validScores.reduce((acc, score) => acc + score, 0) /
                        validScores.length
                    )
                  : 0;
              })()}
              %
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {performanceByTopic.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="history">Quiz History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-48"></div>
                        <div className="h-4 bg-muted rounded w-32"></div>
                      </div>
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <StaggerChildren className="space-y-4">
              {filteredHistory.map((item) => (
                <StaggerItem key={item.id}>
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        <div>
                          <h3 className="font-medium text-lg">
                            {item.quizTitle}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatRelativeTime(item.completedAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4" />
                              <span>{item.totalQuestions} questions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeTaken(item.timeTaken)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBadgeColor(
                                item.score
                              )} text-white`}
                            >
                              <span className="text-xl font-bold">
                                {item.score}%
                              </span>
                            </div>
                            <span className="text-xs mt-1 text-muted-foreground">
                              Score
                            </span>
                          </div>
                          <Button asChild>
                            <Link
                              href={`/dashboard/quiz/preview/${item.quizId}`}
                            >
                              Retake Quiz
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn>
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No quiz history found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No quizzes match your search query"
                    : "You haven't taken any quizzes yet"}
                </p>
                <Button asChild>
                  <Link href="/explore">
                    <Search className="mr-2 h-4 w-4" /> Find Quizzes to Practice
                  </Link>
                </Button>
              </div>
            </FadeIn>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceByTopic.map((item) => (
                    <div key={item.topic} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{item.topic}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.attempts} attempts
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.averageScore}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-right">
                        {item.averageScore}% average
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${getScoreBadgeColor(
                          item.score
                        )} text-white flex-shrink-0`}
                      >
                        <span className="text-sm font-bold">{item.score}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {item.quizTitle}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatRelativeTime(item.completedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="min-h-[300px] grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {achievements.length === 0 ? (
              <Card className="flex flex-1 items-center justify-center">
                <CardContent className="p-6 flex flex-col items-center text-center w-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    No Achievements Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Complete more quizzes to unlock achievements!
                  </p>
                </CardContent>
              </Card>
            ) : (
              achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="card-hover flex flex-col h-full"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {achievement.description}
                    </p>
                    <Badge variant="outline" className="mt-auto">
                      {formatRelativeTime(achievement.date)}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
