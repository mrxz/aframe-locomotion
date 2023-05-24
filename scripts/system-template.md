# {{registeredName}}
{{fromComment comment.summary}}

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
{{#each schema}}
| {{this.name}} | {{fromCommentInline this.comment.summary}} | `{{this.type}}` | {{this.default}} |
{{else}}
| This system has no properties ||||
{{/each}}

{{#each comment.blockTags}}
{{#if (eq this.tag "@remarks")}}
## Remarks
{{fromComment this.content}}
{{/if}}
{{#if (eq this.tag "@example")}}
## Example
{{fromComment this.content}}
{{/if}}
{{/each}}

{{#if sources}}
## Source
{{#each sources}}
[`{{this.fileName}}:{{this.line}}`]({{this.url}})
{{/each}}
{{/if}}