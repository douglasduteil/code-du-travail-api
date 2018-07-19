const elasticsearchClient = require('../conf/elasticsearch.js')

const elasticsearchIndexName = 'code_du_travail_numerique'

/**
 * Return documents matching the given query from Elasticsearch.
 *
 * @param {string} query The query to search for.
 * @param {int} size The number of results to return.
 * @returns {Object} An elasticsearch response.
 */
async function search (query, size) {

  let elasticsearchQuery = {
    index: elasticsearchIndexName,
    body: {
      size: size,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: query,
                fields: [
                  'all_text.french_heavy',
                  'all_text.french_light',
                ],
                type: 'most_fields',
                minimum_should_match: '60%',
              },
            },
          ],
          should: [
            {
              multi_match: {
                query: query,
                fields: [
                  'title.french_heavy',
                  'title.french_light',
                ],
                type: 'most_fields',
                boost: 2000,
              },
            },
            {
              multi_match: {
                query: query,
                fields: [
                  'all_text.french_heavy',
                  'all_text.french_light',
                ],
                type: 'phrase',
                boost: 1000,
              },
            },
            {
              multi_match: {
                query: query,
                fields: [
                  'path.french_heavy',
                  'path.french_light',
                ],
                type: 'most_fields',
                boost: 500,
              },
            },
          ],
        },
      },
      highlight: {
        order: 'score',
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
        fields: {
          'title.french_heavy': {
            number_of_fragments: 20,
          },
          'title.french_light': {
            number_of_fragments: 20,
          },
          'all_text.french_heavy': {
            number_of_fragments: 20,
          },
          'all_text.french_light': {
            number_of_fragments: 20,
          },
          'path.french_heavy': {
            number_of_fragments: 20,
          },
          'path.french_light': {
            number_of_fragments: 20,
          },
        },
      },
    },
  }

  try {
    return await elasticsearchClient.search(elasticsearchQuery)
  } catch (error) {
    console.trace(error.message)
  }

}

module.exports = {
  search,
}
