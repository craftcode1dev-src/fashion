import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/catalog';
import ProductDetail from './ProductDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: 'Product Not Found' };

  const description = product.subtitle
    ? `${product.subtitle} — ${product.description}`
    : product.description;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — Maison Valère`,
      description,
      type: 'website',
      images: product.images.map((image) => ({
        url: image.image_url,
        alt: image.alt_text ?? product.name,
      })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
