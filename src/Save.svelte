
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { get, set } from "./db"

  export let key = "key";
  export let value = "";

  onMount(async () => {
      value = await get(key);
  });
</script>

<div>
  <slot>Localstorage</slot>
  <div>
    <input bind:value={value}/>
    <button on:click={() => set(key, value)}>Save</button>
  </div>
</div>
