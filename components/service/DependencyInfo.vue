<template>
  <ul>
    <li v-for="item in items" :key="item.key">
      <strong>{{ item.label }}</strong>
      <ul v-if="Array.isArray(item.value)">
        <li v-for="(value, i) in item.value" :key="i">
          {{ value }}
        </li>
      </ul>
      <span v-else>{{ item.value }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    dependency: {
      type: Object,
      required: true
    }
  },
  computed: {
    items() {
      return [
        { label: 'Image', value: this.dependency.image },
        { label: 'Volumes', value: this.dependency.volumes },
        { label: 'VolumesFrom', value: this.dependency.volumesFrom },
        { label: 'Ports', value: this.dependency.ports },
        { label: 'command', value: this.dependency.command },
        { label: 'Args', value: this.dependency.args },
        { label: 'Environmental variables', value: this.dependency.env }
      ].filter((x) => x.value)
    }
  }
}
</script>
