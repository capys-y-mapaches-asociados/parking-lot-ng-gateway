import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('ParkingSpot e2e test', () => {
  const parkingSpotPageUrl = '/parking-spot';
  const parkingSpotPageUrlPattern = new RegExp('/parking-spot(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const parkingSpotSample = {"number":24183,"status":"OUT_OF_SERVICE","spotType":"LOADING"};

  let parkingSpot;
  // let parkingLot;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/parkinglot/api/parking-lots',
      body: {"name":"Argentine","location":"primary Coordinator e-markets","capacity":3071},
    }).then(({ body }) => {
      parkingLot = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/parkinglot/api/parking-spots+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/parkinglot/api/parking-spots').as('postEntityRequest');
    cy.intercept('DELETE', '/services/parkinglot/api/parking-spots/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/parkinglot/api/parking-lots', {
      statusCode: 200,
      body: [parkingLot],
    });

  });
   */

  afterEach(() => {
    if (parkingSpot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/parkinglot/api/parking-spots/${parkingSpot.id}`,
      }).then(() => {
        parkingSpot = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (parkingLot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/parkinglot/api/parking-lots/${parkingLot.id}`,
      }).then(() => {
        parkingLot = undefined;
      });
    }
  });
   */

  it('ParkingSpots menu should load ParkingSpots page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('parking-spot');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ParkingSpot').should('exist');
    cy.url().should('match', parkingSpotPageUrlPattern);
  });

  describe('ParkingSpot page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(parkingSpotPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ParkingSpot page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/parking-spot/new$'));
        cy.getEntityCreateUpdateHeading('ParkingSpot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingSpotPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/parkinglot/api/parking-spots',
          body: {
            ...parkingSpotSample,
            parkingLot: parkingLot,
          },
        }).then(({ body }) => {
          parkingSpot = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/parkinglot/api/parking-spots+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/parkinglot/api/parking-spots?page=0&size=20>; rel="last",<http://localhost/services/parkinglot/api/parking-spots?page=0&size=20>; rel="first"',
              },
              body: [parkingSpot],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(parkingSpotPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(parkingSpotPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ParkingSpot page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('parkingSpot');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingSpotPageUrlPattern);
      });

      it('edit button click should load edit ParkingSpot page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ParkingSpot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingSpotPageUrlPattern);
      });

      it('edit button click should load edit ParkingSpot page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ParkingSpot');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingSpotPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ParkingSpot', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('parkingSpot').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingSpotPageUrlPattern);

        parkingSpot = undefined;
      });
    });
  });

  describe('new ParkingSpot page', () => {
    beforeEach(() => {
      cy.visit(`${parkingSpotPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ParkingSpot');
    });

    it.skip('should create an instance of ParkingSpot', () => {
      cy.get(`[data-cy="number"]`).type('35336').should('have.value', '35336');

      cy.get(`[data-cy="status"]`).select('AVAILABLE');

      cy.get(`[data-cy="spotType"]`).select('DISABLED');

      cy.get(`[data-cy="parkingLot"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        parkingSpot = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', parkingSpotPageUrlPattern);
    });
  });
});
