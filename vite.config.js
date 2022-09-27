import nunjucks from "vite-plugin-nunjucks"

const config = {
  base: "/kagi-try/",
  plugins: [
    nunjucks({
      variables: {
        "index.html": {
          short: [
            "1 pound sweet Italian sausage",
            "3/4 pound lean ground beef",
            "1/2 cup minced onion",
            "2 cloves garlic, crushed",
            "1 (28 ounce) can crushed tomatoes",
            "2 (6 ounce) cans tomato paste",
            "2 (6.5 ounce) cans canned tomato sauce",
            "1/2 cup water",
            "2 tablespoons white sugar",
            "1 1/2 teaspoons dried basil leaves"
          ],
          medium: [
            "1 pound sweet Italian sausage",
            "3/4 pound lean ground beef",
            "1/2 cup minced onion",
            "2 cloves garlic, crushed",
            "1 (28 ounce) can crushed tomatoes",
            "2 (6 ounce) cans tomato paste",
            "2 (6.5 ounce) cans canned tomato sauce",
            "1/2 cup water",
            "2 tablespoons white sugar",
            "1 1/2 teaspoons dried basil leaves",
            "1/2 teaspoon fennel seeds"
          ],
          large: [
            "1 pound sweet Italian sausage",
            "3/4 pound lean ground beef",
            "1/2 cup minced onion",
            "2 cloves garlic, crushed",
            "1 (28 ounce) can crushed tomatoes",
            "2 (6 ounce) cans tomato paste",
            "2 (6.5 ounce) cans canned tomato sauce",
            "1/2 cup water",
            "2 tablespoons white sugar",
            "1 1/2 teaspoons dried basil leaves",
            "1/2 teaspoon fennel seeds",
            "1 teaspoon Italian seasoning",
            "11/2 teaspoons salt, divided or to taste",
            "1/4 teaspoon ground black pepper",
            "4 tablespoons chopped fresh parsley",
            "12 lasagna noodles",
            "16 ounces ricotta cheese",
            "1 egg",
            "3/4 pound mozzarella cheese, sliced",
            "3/4 cup grated Parmesan cheese",
            "2 cloves garlic, crushed"
          ]
        }
      }
    })
  ]
}

export default config
