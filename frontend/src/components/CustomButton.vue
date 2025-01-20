<template>
  <button
    :style="{ backgroundColor: color, color: textColor }"
    class="custom-button"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#007bff", // Couleur par défaut (bleu)
    },
    textColor: {
      type: String,
      default: "#ffffff", // Couleur du texte par défaut (blanc)
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
  @import "@/css/composents/CustomButton.css";
</style>
