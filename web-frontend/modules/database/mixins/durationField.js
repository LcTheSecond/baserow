import { DurationFieldType } from '@baserow/modules/database/fieldTypes'

/**
 * This mixin contains some method overrides for validating and formatting the
 * duration field. This mixin is used in both the GridViewFieldDuration and
 * RowEditFieldDuration components.
 */
export default {
  data() {
    return {
      errorMsg: null,
      formattedValue: '',
    }
  },
  computed: {
    fieldType() {
      return this.$registry.get('field', DurationFieldType.getType())
    },
  },
  watch: {
    value(value) {
      this.updateFormattedValue(this.field, value)
    },
  },
  created() {
    this.updateFormattedValue(this.field, this.value)
  },
  methods: {
    getField() {
      return this.field
    },
    isValid() {
      return this.errorMsg === null
    },
    getError() {
      return this.errorMsg
    },
    formatValue(field, value) {
      return this.fieldType.formatValue(field, value)
    },
    updateFormattedValue(field, value) {
      this.formattedValue = this.formatValue(field, value)
    },
    updateCopy(field, value) {
      this.errorMsg = this.getValidationError(value)
      if (this.errorMsg !== null) {
        return
      }
      const newCopy = this.fieldType.parseInputValue(field, value)
      if (newCopy !== this.copy) {
        this.copy = newCopy
        return newCopy
      }
    },
    isValidChar(char) {
      const allowedChars = ['.', ':', ' ', 'd', 'h']
      return /\d/.test(char) || allowedChars.includes(char)
    },
    onKeyPress(field, event) {
      if (!this.isValidChar(event.key)) {
        return event.preventDefault()
      }
    },
    onInput(field, event) {
      this.updateCopy(field, event.target.value)
    },
  },
}
