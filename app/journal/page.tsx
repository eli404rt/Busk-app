import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JournalPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto py-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 font-mono text-white">Journal Entries</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allPostsData.map(({ slug, title, date, description }) => (
          <Card key={slug} className="flex flex-col bg-black text-white border border-white hover:border-orange-500 transition-colors duration-200">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-tight mb-2 font-mono text-white">
                <Link href={`/journal/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </CardTitle>
              <Badge className="w-fit bg-transparent text-orange-500 font-mono">
                {date}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-300 font-mono">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
