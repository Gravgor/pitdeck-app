import { Metadata } from 'next';
import Image from 'next/image';
import { CardGrid } from '@/components/cards/CardGrid';
import { Trophy, Users, Star, Calendar } from 'lucide-react';
import { getSeriesData } from '@/lib/series';

interface SeriesPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesData(slug);
  return {
    title: `${series.name} Cards | PitDeck`,
    description: series.description,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = await getSeriesData(slug);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px]">
        <Image
          src={series.heroImage}
          alt={series.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {series.name}
              </h1>
              <p className="text-lg text-gray-300">
                {series.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              icon={Trophy}
              value={series.stats.totalCards}
              label="Total Cards"
            />
            <StatCard
              icon={Star}
              value={series.stats.legendaryCards}
              label="Legendary Cards"
            />
            <StatCard
              icon={Users}
              value={series.stats.collectors}
              label="Collectors"
            />
            <StatCard
              icon={Calendar}
              value={series.stats.events}
              label="Events"
            />
          </div>
        </div>
      </div>

      {/* Featured Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Featured Cards</h2>
          <CardGrid cards={series.featuredCards} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {series.categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function StatCard({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) {
  return (
    <div className="text-center">
      <Icon className="h-6 w-6 text-red-500 mx-auto mb-2" />
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function CategoryCard({ name, description, image, count }: any) {
  return (
    <div className="relative group rounded-xl overflow-hidden">
      <Image
        src={image}
        alt={name}
        width={400}
        height={300}
        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <span className="text-sm text-white/60">{count} cards</span>
      </div>
    </div>
  );
} 