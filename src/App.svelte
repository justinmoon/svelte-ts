<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { myStore, message } from "./store";

  import Counter from "./Counter.svelte";
  import Save from "./Save.svelte";

  const count = writable(100);
  const unsubscribe = count.subscribe(value => console.log("count", value));

  onMount(() => {
    console.log("App mounted");
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {message}!</h1>
<p>
  <Counter />
  <Counter value={1}>Counter 1</Counter>
  <Counter bind:value={$count} step={3}>Counter 2</Counter>
  <Counter bind:value={$myStore} step={5}>Counter 3</Counter>
  <Save/>
</p>
