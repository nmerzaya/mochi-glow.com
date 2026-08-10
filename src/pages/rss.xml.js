import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config';

export async function GET(context) {
  const ingredienten = await getCollection('ingredienten');
  const gutSkin = await getCollection('gut-skin');

  const items = [
    ...ingredienten.map((artikel) => ({ artikel, pad: 'ingredienten' })),
    ...gutSkin.map((artikel) => ({ artikel, pad: 'gut-skin' })),
  ]
    .sort((a, b) => b.artikel.data.publicatiedatum.getTime() - a.artikel.data.publicatiedatum.getTime())
    .map(({ artikel, pad }) => ({
      title: artikel.data.titel,
      description: artikel.data.beschrijving,
      pubDate: artikel.data.publicatiedatum,
      link: `/${pad}/${artikel.id}/`,
      categories: artikel.data.tags,
      author: artikel.data.auteur,
    }));

  return rss({
    title: `${site.naam} — ${site.tagline}`,
    description: site.beschrijving,
    site: context.site ?? site.url,
    items,
    customData: '<language>nl-nl</language>',
  });
}
