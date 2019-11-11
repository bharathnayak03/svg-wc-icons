
# svg-wc-icons


svg-wc-icons is a tool to convert svg icons into reusable web components.

now you can import, style only those icons which are required by your ui instead of using font icon css for all your icons.
also generated webcomponents encapsulates internal details of the svg icons into shadow dom hence the generated markup is very clean. and no longer includes any of the svg tags.

and since the main benefit of using webcomponents is interoperability, generated icons can be used in any project with any kind of javascript frameworks



## Installation

Use the node package manage to install svg-wc-icons.



```bash
npm install -g svg-wc-icons

```
------------

## Usage

```bash
#basic usage
svg-wc-icons --src './src' --dest './dist'

#use external svgo json config
svg-wc-icons --src './src' --dest './dist' --svgoConfig './svgo.config.json'

#use custom prefix in generated webcomponents
svg-wc-icons --src './src' --dest './dist' --prefix myCompany

#use custom suffix in generated webcomponents
svg-wc-icons --src './src' --dest './dist' --prefix icon --suffix ' '

#generate example html
svg-wc-icons --src './src' --dest './dist' --example true

#pass custom css to be applied for all the generated web components
svg-wc-icons --src './src' --dest './dist' --style ':host { font-size: 24px; color: red; }'
```
------------

### Using generated web components in our project



```css
activity-icon {
color: red;
font-size: 24px;
}
```


```html
<script  type="module"  src="./dist/activity_icon.js"></script>
<activity-icon  />
```
------------

### Generating webcomponent based icons for external icons ex: google material icons

```bash
git clone https://github.com/google/material-design-icons.git
svg-wc-icons --src './material-design-icons/social/svg/production' --dest './web-components-icons' --example --style ':host { font-size: 40px; color: red;}'
```
------------

## How it works
This package depends on svgo to strip out unwanted markups from svgs.
i.e. style element, color and fill atributes are stripped off from svgs so that it can be colored or styled from outside.
then few extra attributes are added to the svg element to support external styling. (ex: fill="currentColor")
then optimized svg is rendered inside the shadow dom so that it can be used easily in our markup as custom elements

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License

[MIT](https://choosealicense.com/licenses/mit/)
