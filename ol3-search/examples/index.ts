export function run() {
    let l = window.location;
    let path = `${l.origin}${l.pathname}?run=ol3-search/examples/`;
    let labs = `
    form-options
    bing-search
    google-search
    layer-search
    mapquest-search
    osm-search
    wfs-search
    ol3-search
    index
    `;

    let styles = document.createElement("style");
    document.head.appendChild(styles);

    styles.innerText += `
    #map {
        display: none;
    }
    .test {
        margin: 20px;
    }
    `;

    let html = labs
        .split(/ /)
        .map(v => v.trim())
        .filter(v => !!v)
        //.sort()
        .map(lab => `<div class='test'><a href='${path}${lab}&debug=0'>${lab}</a></div>`)
        .join("\n");


    html += `<a href='${l.origin}${l.pathname}?run=ol3-search/tests/index'>tests</a>`;

    document.write(html);
};