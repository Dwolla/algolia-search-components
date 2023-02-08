import type { AutocompleteOptions, AutocompleteSource, SourceTemplates } from "@algolia/autocomplete-js";
import { autocomplete, getAlgoliaResults } from "@algolia/autocomplete-js";
import type { HighlightedHit } from "@algolia/autocomplete-preset-algolia";
import type { SearchOptions } from "@algolia/client-search";
import type { SearchClient } from "algoliasearch/lite";
import type { FC } from "react";
import { createElement, Fragment, useEffect, useRef } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import type { AlgoliaRecord } from "./types";
import { TEMPLATES } from "./templates";
import computeIndexName from "./utils/computeIndexName";
import debouncePromise from "./utils/debouncePromise";

import "./index.scss";

interface AlgoliaAutocompleteProps extends Partial<AutocompleteOptions<AlgoliaRecord>> {
  branch: string;
  debounceTimeout?: number;
  searchClient: SearchClient;
  searchOptions?: SearchOptions;
  siteId: string;
}

type AlgoliaSource = AutocompleteSource<HighlightedHit<AlgoliaRecord>>;

const getSources = (
  searchClient: SearchClient,
  indexName: string,
  params?: SearchOptions,
  debounceTimeout?: number
): Promise<AlgoliaSource> => {
  const templates: SourceTemplates<HighlightedHit<AlgoliaRecord>> = {
    header: () => "",
    item: ({ item, components }) => TEMPLATES.item(item, components),
    footer: () => TEMPLATES.poweredBy()
  };

  return tryDebounce(
    {
      sourceId: "algoliaHits",
      getItems: ({ query }) => {
        return getAlgoliaResults({
          searchClient,
          queries: [{ indexName, query, params }]
        });
      },
      getItemUrl: ({ item }) => item.url,
      templates
    },
    debounceTimeout
  );
};

const tryDebounce = async (items: AlgoliaSource, time?: number): Promise<AlgoliaSource> =>
  new Promise<AlgoliaSource>((resolve) =>
    time ? debouncePromise((items) => resolve(items), time)(items) : resolve(items)
  );

const AlgoliaAutocomplete: FC<AlgoliaAutocompleteProps> = (props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const search = autocomplete<AlgoliaRecord>({
      autoFocus: false,
      container: containerRef.current,
      getSources: async () => [
        await getSources(
          props.searchClient,
          computeIndexName(props.branch, props.siteId),
          props.searchOptions,
          props.debounceTimeout
        )
      ],
      panelPlacement: "input-wrapper-width",
      placeholder: "Search...",
      render: ({ children }, root) => {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }
        panelRootRef.current?.render(children);
      },
      renderer: {
        createElement,
        Fragment,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        render: () => {}
      },
      ...props
    });

    return () => search?.destroy();
  }, [props]);

  return <div ref={containerRef} />;
};

export default AlgoliaAutocomplete;
