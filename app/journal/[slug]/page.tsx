import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-4 px-8 bg-black flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-orange-500 transition-transform transform hover:scale-105">agent404</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-white hover:text-orange-500 transition-colors duration-300">Home</a></li>
            <li><a href="/journal" className="text-white hover:text-orange-500 transition-colors duration-300">Journal</a></li>
            <li><a href="/gallery" className="text-white hover:text-orange-500 transition-colors duration-300">Gallery</a></li>
          </ul>
        </nav>
      </header>

      <div className="container mx-auto py-8">
        <Card className="bg-gray-900 text-white border border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-2 text-orange-500 transition-transform transform hover:scale-105">
              {postData.title}
            </CardTitle>
            <Badge className="w-fit bg-orange-500 text-black font-mono px-2 py-1 rounded">
              {postData.date}
            </Badge>
          </CardHeader>
          <CardContent>
            <div
              className="prose dark:prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
