# svg-wc-icons

svg-wc-icons is a tool to convert svg icons (auto generated) into reusable web components

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
npm install -g svg-wc-icons
```

## Usage

```bash
#basic usage
svg-wc-icons --src './src' --dist './dist'

#use external svgo json config
svg-wc-icons --src './src' --dist './dist'  --svgoConfig './svgo.config.json'

#use custom prefix in generated webcomponents based icons
svg-wc-icons --src './src' --dist './dist' --prefix myCompany

```

### Using generated web components in our project

```css
activity-icon {
 color: red;
 font-size: 24px;
}
```

```html
<script type="module" src="./dist/activity_icon.js"></script>
<activity-icon />
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
