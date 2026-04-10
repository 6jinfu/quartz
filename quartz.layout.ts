import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

const docsSort = (a: FileTrieNode, b: FileTrieNode) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const rawA = (
      a.data?.filePath.split("/").pop()?.replace(/\.md$/i, "") ??
      a.slugSegment ??
      a.displayName
    ).toLowerCase()
    const rawB = (
      b.data?.filePath.split("/").pop()?.replace(/\.md$/i, "") ??
      b.slugSegment ??
      b.displayName
    ).toLowerCase()

    return rawA.localeCompare(rawB, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  return a.isFolder ? -1 : 1
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/6jinfu/quartz",
      Website: "https://quartz-bw0.pages.dev/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "文档导航",
      folderDefaultState: "open",
      folderClickBehavior: "collapse",
      sortFn: docsSort,
    }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "文档导航",
      folderDefaultState: "open",
      folderClickBehavior: "collapse",
      sortFn: docsSort,
    }),
  ],
  right: [],
}
