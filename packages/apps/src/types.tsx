/* eslint-disable @typescript-eslint/camelcase */

/*
pub struct DefaultParameters {
	pub can_be_nominated: bool,
	pub option_expired: u128,
	pub option_p: u128,
}
*/

const types = {
    Parameters: {
      can
      id: 'Hash'
    },
    Book: {
      id: 'Hash',
      title: 'Vec<u8>',
      author: 'Author<Hash>'
    },
    Publisher: {
      id: 'Hash'
    },
    Seller: {
      id: 'Hash'
    },
    PublishingContract: {
      id: 'Hash',
      publisher: 'Publisher<Hash>',
      author: 'Author<Hash>',
      book: 'Book<Hash>'
    },
    SalesContract: {
      id: 'Hash',
      seller: 'Seller<Hash>',
      publishingContract: 'PublishingContract<Hash>'
    }
  };
  
  export default types;