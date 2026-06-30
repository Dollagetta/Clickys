const fs = require('fs');
const path = './app/guides/slug/page.jsx';
let code = fs.readFileSync(path, 'utf8');

const replacements = [
  {
    target: `          {guide.isPrismic ? (
            <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <PrismicRichText field={guide.description} components={richTextComponents} />
            </div>
          ) : (`,
    replacement: `          {guide.isPrismic ? (
            <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-3xl font-black text-gray-900 mb-6 pb-2 border-b-4 border-green-500 inline-block">Product Overview</h2>
              <PrismicRichText field={guide.description} components={richTextComponents} />
            </div>
          ) : (`
  },
  {
    target: `            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <PrismicRichText field={guide.features} components={richTextComponents} />
              </div>
            ) : (`,
    replacement: `            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-blue-500 after:rounded-full">Key Features</h2>
                <PrismicRichText field={guide.features} components={richTextComponents} />
              </div>
            ) : (`
  },
  {
    target: `                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-green-50/30 transition-colors rounded-xl p-2 -m-2">
                    <PrismicRichText field={guide.pros} components={richTextComponents} />
                  </div>
                ) : (`,
    replacement: `                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-green-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">✓</div>
                      What we love
                    </h2>
                    <PrismicRichText field={guide.pros} components={richTextComponents} />
                  </div>
                ) : (`
  },
  {
    target: `                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-red-50/30 transition-colors rounded-xl p-2 -m-2">
                    <PrismicRichText field={guide.cons} components={richTextComponents} />
                  </div>
                ) : (`,
    replacement: `                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-red-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">×</div>
                      Things to consider
                    </h2>
                    <PrismicRichText field={guide.cons} components={richTextComponents} />
                  </div>
                ) : (`
  },
  {
    target: `            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <PrismicRichText field={guide.alternatives} components={richTextComponents} />
              </div>
            ) : (`,
    replacement: `            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-2 border-b-4 border-indigo-500 inline-block">Alternatives Considered</h2>
                <PrismicRichText field={guide.alternatives} components={richTextComponents} />
              </div>
            ) : (`
  }
];

let changedCount = 0;
for (const { target, replacement } of replacements) {
  if (code.includes(target)) {
    code = code.replace(target, replacement);
    changedCount++;
  } else {
    console.log("Could not find target:\\n", target);
  }
}
fs.writeFileSync(path, code);
console.log('Made ' + changedCount + ' replacements.');
