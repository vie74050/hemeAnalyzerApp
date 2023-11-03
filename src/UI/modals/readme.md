# Bootstrap modals

See:

- [Bootstrap documentation](https://getbootstrap.com/docs/5.3/components/modal/#how-it-works)  
- [mdbootstrap](https://mdbootstrap.com/docs/standard/components/modal/#!)

## TL;DR

On the triggering button or element, add the attributes

```html
    type="button"
    data-bs-toggle="modal"
    data-bs-target="#{{id}}"
```

Sample modal markup template:

```html
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```
