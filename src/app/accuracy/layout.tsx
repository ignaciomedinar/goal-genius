import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Prediction Accuracy by League - Goal Genius",
  description:
    "See Goal Genius's real prediction accuracy across all football leagues. Overall accuracy, top-10 confidence picks, and a full breakdown by league — updated automatically.",
  keywords:
    "football prediction accuracy, soccer tips accuracy, prediction model performance, AI football accuracy, Premier League prediction stats, football tipster track record",
};

export default function AccuracyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
