import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JournalPage() {
  const allPostsData = getSortedPostsData();
  const featurePost = allPostsData[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-4 px-8 bg-gray-900 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">agent404</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-white hover:text-orange-500">Home</Link></li>
            <li><Link href="/journal" className="text-white hover:text-orange-500">Journal</Link></li>
            <li><Link href="/gallery" className="text-white hover:text-orange-500">Gallery</Link></li>
          </ul>
        </nav>
      </header>

      <div className="container mx-auto py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-orange-500">Featured Post</h2>
          <Card className="flex flex-col bg-gray-900 text-white border border-white hover:border-orange-500 hover:shadow-lg hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold leading-tight mb-2 font-mono text-white">
                <Link
                  href={`/journal/${featurePost.slug}`}
                  className="hover:underline hover:text-orange-500 transition-colors duration-200"
                >
                  {featurePost.title}
                </Link>
              </CardTitle>
              <Badge className="w-fit bg-orange-500 text-black font-mono px-2 py-1 rounded">
                {featurePost.date}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 font-mono">{featurePost.description}</p>
            </CardContent>
          </Card>
        </section>

        <h1 className="text-4xl font-bold mb-8 font-mono text-white">Journal Entries</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPostsData.slice(1).map(({ slug, title, date, description }) => (
            <Card
              key={slug}
              className="flex flex-col bg-black text-white border border-white hover:border-orange-500 hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold leading-tight mb-2 font-mono text-white">
                  <Link
                    href={`/journal/${slug}`}
                    className="hover:underline hover:text-orange-500 transition-colors duration-200"
                  >
                    {title}
                  </Link>
                </CardTitle>
                <Badge className="w-fit bg-orange-500 text-black font-mono px-2 py-1 rounded">
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
    </div>
  );
}
