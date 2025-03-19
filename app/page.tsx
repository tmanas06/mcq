import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Cybersecurity MCQ Test
      </h1>
      <p className="text-lg text-center mb-8">
        Test your knowledge with our comprehensive set of cybersecurity multiple choice questions.
      </p>
      <p className="text-center text-muted-foreground mb-4">
        Choose the number of questions you want to attempt:
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/quiz?count=10" className="w-full">
          <Button className="w-full" size="lg">
            Take 10 Question Test
          </Button>
        </Link>
        <Link href="/quiz?count=320" className="w-full">
          <Button className="w-full" variant="outline" size="lg">
            Take Full Test (all Questions)
          </Button>
        </Link>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">
        Practice well
      </p>
    </div>
  );
}
