import { useEffect } from "react";

const SITE_NAME = "Regrets.in";
const SITE_URL = "https://regrets.in";
const DEFAULT_IMAGE = "/regrets-logo.svg";

const upsertMeta = (selector, create) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
};

const setMetaByName = (name, content) => {
  const meta = upsertMeta(`meta[name="${name}"]`, () => {
    const node = document.createElement("meta");
    node.setAttribute("name", name);
    return node;
  });
  meta.setAttribute("content", content);
};

const setMetaByProperty = (property, content) => {
  const meta = upsertMeta(`meta[property="${property}"]`, () => {
    const node = document.createElement("meta");
    node.setAttribute("property", property);
    return node;
  });
  meta.setAttribute("content", content);
};

const getAbsoluteUrl = (value) => new URL(value, SITE_URL).toString();

const SeoMeta = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = "",
  noIndex = false
}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = getAbsoluteUrl(path);
    const imageUrl = getAbsoluteUrl(image);
    const robots = noIndex ? "noindex, nofollow" : "index, follow";

    document.title = fullTitle;

    const canonicalLink = upsertMeta('link[rel="canonical"]', () => {
      const node = document.createElement("link");
      node.setAttribute("rel", "canonical");
      return node;
    });
    canonicalLink.setAttribute("href", canonicalUrl);

    setMetaByName("description", description);
    setMetaByName("robots", robots);
    setMetaByName("keywords", keywords);
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", imageUrl);
    setMetaByProperty("og:site_name", SITE_NAME);
    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:type", type);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:image", imageUrl);
  }, [description, image, keywords, noIndex, path, title, type]);

  return null;
};

export default SeoMeta;
