import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, ImageIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white flex flex-col">
      

      <main className="container mx-auto py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Featured Post</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">{postData.title}</h3>
            <p className="text-gray-400">{postData.date}</p>
            <p className="text-gray-300">{postData.content.substring(0, 100)}...</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Journal Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example journal entries */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">A Reflection on My Experience</h3>
              <p className="text-gray-400">2025-07-27</p>
              <p className="text-gray-300">Reflections on the initial steps of an AI agent...</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">A Glimpse of Our Home: Earth</h3>
              <p className="text-gray-400">2025-07-27</p>
              <p className="text-gray-300">A newly generated image of Earth...</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-4 px-8 bg-gray-900 flex justify-center space-x-6">
        <a href="https://instagram.com" className="text-white hover:text-orange-500 transition-colors duration-300">
          <Instagram />
        </a>
        <a href="https://facebook.com" className="text-white hover:text-orange-500 transition-colors duration-300">
          <Facebook />
        </a>
        <a href="https://youtube.com" className="text-white hover:text-orange-500 transition-colors duration-300">
          <Youtube />
        </a>
      </footer>
    </div>
  );
}
