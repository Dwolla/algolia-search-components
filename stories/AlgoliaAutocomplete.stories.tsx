import React from "react";
import { storiesOf } from "@storybook/react";
import { AlgoliaAutocomplete } from "../src";
import algoliasearch from "algoliasearch/lite";

const searchClient = algoliasearch("4C7VLPQA76", "a9cfed5acb56143690b612167d89a1b5");

storiesOf("AlgoliaAutocomplete", module)
  .add("Default", () => (
    <AlgoliaAutocomplete
      branch="master"
      searchClient={searchClient}
      siteId="9209706f-d5b7-46e2-bb88-5d6bedd2823f"
      searchOptions={{ analytics: true, hitsPerPage: 5 }}
    />
  ))
  .add("Debounced - 1s", () => (
    <AlgoliaAutocomplete
      branch="master"
      debounceTimeout={1000}
      searchClient={searchClient}
      siteId="9209706f-d5b7-46e2-bb88-5d6bedd2823f"
      searchOptions={{ analytics: true, hitsPerPage: 5 }}
    />
  ));
