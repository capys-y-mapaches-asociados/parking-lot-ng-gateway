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

describe('ParkingLot e2e test', () => {
  const parkingLotPageUrl = '/parking-lot';
  const parkingLotPageUrlPattern = new RegExp('/parking-lot(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const parkingLotSample = { name: 'salmon SAS connect', location: 'British Unions', capacity: 12414 };

  let parkingLot;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/parkinglot/api/parking-lots+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/parkinglot/api/parking-lots').as('postEntityRequest');
    cy.intercept('DELETE', '/services/parkinglot/api/parking-lots/*').as('deleteEntityRequest');
  });

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

  it('ParkingLots menu should load ParkingLots page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('parking-lot');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ParkingLot').should('exist');
    cy.url().should('match', parkingLotPageUrlPattern);
  });

  describe('ParkingLot page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(parkingLotPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ParkingLot page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/parking-lot/new$'));
        cy.getEntityCreateUpdateHeading('ParkingLot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingLotPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/parkinglot/api/parking-lots',
          body: parkingLotSample,
        }).then(({ body }) => {
          parkingLot = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/parkinglot/api/parking-lots+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [parkingLot],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(parkingLotPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ParkingLot page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('parkingLot');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingLotPageUrlPattern);
      });

      it('edit button click should load edit ParkingLot page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ParkingLot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingLotPageUrlPattern);
      });

      it('edit button click should load edit ParkingLot page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ParkingLot');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingLotPageUrlPattern);
      });

      it('last delete button click should delete instance of ParkingLot', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('parkingLot').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parkingLotPageUrlPattern);

        parkingLot = undefined;
      });
    });
  });

  describe('new ParkingLot page', () => {
    beforeEach(() => {
      cy.visit(`${parkingLotPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ParkingLot');
    });

    it('should create an instance of ParkingLot', () => {
      cy.get(`[data-cy="name"]`).type('blockchains').should('have.value', 'blockchains');

      cy.get(`[data-cy="location"]`).type('azure Somoni Ohio').should('have.value', 'azure Somoni Ohio');

      cy.get(`[data-cy="capacity"]`).type('1682').should('have.value', '1682');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        parkingLot = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', parkingLotPageUrlPattern);
    });
  });
});
