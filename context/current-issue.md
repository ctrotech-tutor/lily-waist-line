Read `AGENTS.md` before starting.

Follow strictly:

* `context/project-overview.md`
* `context/architecture-context.md`
* `context/code-standards.md`
* `context/ai-workflow-rules.md`

THEN FIX THIS ALL:

## Error Type
Console Error

## Error Message
Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
  {id: ..., name: ..., slug: ..., shortDescription: ..., description: ..., basePrice: Decimal, compareAtPrice: ..., status: ..., createdAt: ..., updatedAt: ..., variants: ..., images: ..., minPrice: ..., maxPrice: ..., totalStock: ..., inStock: ...}
                                                                                      ^^^^^^^


    at stringify (<anonymous>:1:18)
    at ShopPage (app\(site)\shop\page.tsx:47:7)

## Code Frame
  45 |
  46 |       {/* Shop Layout with Filters, So...
> 47 |       <ShopLayout 
     |       ^
  48 |         showFilters={true} 
  49 |         showSort={true}
  50 |         searchParams={shopParams}

Next.js version: 16.2.6 (Turbopack)

## Error Type
Console Error

## Error Message
Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
  {id: ..., name: ..., slug: ..., shortDescription: ..., description: ..., basePrice: ..., compareAtPrice: Decimal, status: ..., createdAt: ..., updatedAt: ..., variants: ..., images: ..., minPrice: ..., maxPrice: ..., totalStock: ..., inStock: ...}
                                                                                                           ^^^^^^^


    at stringify (<anonymous>:1:18)
    at ShopPage (app\(site)\shop\page.tsx:47:7)

## Code Frame
  45 |
  46 |       {/* Shop Layout with Filters, So...
> 47 |       <ShopLayout 
     |       ^
  48 |         showFilters={true} 
  49 |         showSort={true}
  50 |         searchParams={shopParams}

Next.js version: 16.2.6 (Turbopack)


## Error Type
Console Error

## Error Message
Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
  {id: ..., name: ..., slug: ..., shortDescription: ..., description: ..., basePrice: Decimal, compareAtPrice: ..., status: ..., createdAt: ..., updatedAt: ..., variants: ..., images: ..., minPrice: ..., maxPrice: ..., totalStock: ..., inStock: ...}
                                                                                      ^^^^^^^


    at stringify (<anonymous>:1:18)
    at <unknown> (<anonymous>:null:null)

Next.js version: 16.2.6 (Turbopack)

## Error Type
Console Error

## Error Message
Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
  {id: ..., name: ..., slug: ..., shortDescription: ..., description: ..., basePrice: ..., compareAtPrice: Decimal, status: ..., createdAt: ..., updatedAt: ..., variants: ..., images: ..., minPrice: ..., maxPrice: ..., totalStock: ..., inStock: ...}
                                                                                                           ^^^^^^^


    at stringify (<anonymous>:1:18)
    at <unknown> (<anonymous>:null:null)

Next.js version: 16.2.6 (Turbopack)
