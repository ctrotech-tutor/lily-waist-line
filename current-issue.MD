
PS C:\Projects\project\official\lilly-waist-liner> npm run lint:error

> lilywaist-line@0.1.0 lint:error
> eslint . --quiet


C:\Projects\project\official\lilly-waist-liner\app\(site)\order\payment-proof\[orderId]\payment-proof-upload-client.tsx
  21:46  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Projects\project\official\lilly-waist-liner\components\admin\settings\admin-payment-settings.tsx
  24:5   error  Error: Cannot access variable before it is declared

`loadConfiguration` is accessed before it is declared, which prevents the earlier access from updating when this value changes over time.

C:\Projects\project\official\lilly-waist-liner\components\admin\settings\admin-payment-settings.tsx:24:5
  22 |
  23 |   useEffect(() => {
> 24 |     loadConfiguration();
     |     ^^^^^^^^^^^^^^^^^ `loadConfiguration` accessed before it is declared        
  25 |   }, []);
  26 |
  27 |   const loadConfiguration = async () => {

C:\Projects\project\official\lilly-waist-liner\components\admin\settings\admin-payment-settings.tsx:27:3
  25 |   }, []);
  26 |
> 27 |   const loadConfiguration = async () => {
     |   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 28 |     setIsLoading(true);
     | ^^^^^^^^^^^^^^^^^^^^^^^
> 29 |     try {
     …
     | ^^^^^^^^^^^^^^^^^^^^^^^
> 50 |     }
     | ^^^^^^^^^^^^^^^^^^^^^^^
> 51 |   };
     | ^^^^^ `loadConfiguration` is declared here
  52 |
  53 |   const handleSave = async () => {
  54 |     setIsSaving(true);  react-hooks/immutability
  32:52  error  Unexpected any. Specify a different type











                   @typescript-eslint/no-explicit-any
  33:51  error  Unexpected any. Specify a different type











                   @typescript-eslint/no-explicit-any

C:\Projects\project\official\lilly-waist-liner\components\checkout\payment-instructions.tsx
  20:54  error  Unexpected any. Specify a different type











                                                                                   @typescript-eslint/no-explicit-any
  25:7   error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can 
hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Projects\project\official\lilly-waist-liner\components\checkout\payment-instructions.tsx:25:7
  23 |   useEffect(() => {
  24 |     if (method) {
> 25 |       setIsLoading(true);
     |       ^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  26 |       getPaymentConfiguration().then((result) => {
  27 |         if (result.success && result.data) {
  28 |           const config = result.data.find(  react-hooks/set-state-in-effect     
  29:17  error  Unexpected any. Specify a different type











                                                                                   @typescript-eslint/no-explicit-any

C:\Projects\project\official\lilly-waist-liner\components\order\payment-next-step.tsx  
  28:54  error  Unexpected any. Specify a different type











                                                                                     @typescript-eslint/no-explicit-any
  35:7   error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can 
hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Projects\project\official\lilly-waist-liner\components\order\payment-next-step.tsx:35:7
  33 |   useEffect(() => {
  34 |     if (method) {
> 35 |       setConfigLoading(true);
     |       ^^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect       
  36 |       getPaymentConfiguration().then((result) => {
  37 |         if (result.success && result.data) {
  38 |           const config = result.data.find(  react-hooks/set-state-in-effect     
  39:17  error  Unexpected any. Specify a different type











                                                                                     @typescript-eslint/no-explicit-any

✖ 10 problems (10 errors, 0 warnings)

PS C:\Projects\project\official\lilly-waist-liner> 