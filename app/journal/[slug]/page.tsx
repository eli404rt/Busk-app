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
    <div className="container mx-auto py-8 bg-black text-white">
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-2">{postData.title}</CardTitle>
          <Badge variant="secondary" className="w-fit">
            {postData.date}
          </Badge>
        </CardHeader>
        <CardContent>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
