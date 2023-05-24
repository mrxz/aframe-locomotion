# {{registeredName}}
{{fromComment comment.summary}}

## Properties
| Property | Description | Type | Default Value |
|----------|-------------|------|---------------|
{{#each schema}}
| {{this.name}} | {{fromCommentInline this.comment.summary}} | `{{this.type}}` | {{this.default}} |
{{else}}
| This component has no properties ||||
{{/each}}

{{#if (containsTag "@emits" comment.blockTags)}}
## Events
| Event Name | Description  |
|------------|--------------|
{{#each comment.blockTags}}
{{#if (eq this.tag "@emits")}}
| {{fromEmitsCommentName this.content}} | {{fromEmitsCommentDescription this.content}} |
{{/if}}
{{/each}}
{{/if}}

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