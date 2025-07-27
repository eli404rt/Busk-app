import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JournalPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto py-8 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Journal Entries</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allPostsData.map(({ slug, title, date, description }) => (
          <Card key={slug} className="flex flex-col bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-tight mb-2">
                <Link href={`/journal/${slug}`} className="hover:underline">
                  {title}
                </Link>
              </CardTitle>
              <Badge variant="secondary" className="w-fit">
                {date}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
