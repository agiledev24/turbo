require('dotenv').config({ path: '.env.test' });

// Mock the external fetch requests

// Assuming you have set Cypress environment variables in cypress.json
describe('Video Processing API', () => {
  it('processes video successfully', () => {
    // Stub the network request to https://livepeer.studio/api/transcode
    cy.intercept('POST', 'https://livepeer.studio/api/transcode', {
      statusCode: 200,
      body: { playbackUrl: 'mocked-url' },
    }).as('livepeerTranscode');

    // Make a request to your API endpoint
    cy.request('POST', 'http://localhost:3000/api/video-processing', {
      userId: 'testUser',
      imageUrl: 'http://example.com/test.mp4',
      isVideo: true
    }).then((response) => {
      // Check if the response status code is 201 (Created)
      expect(response.status).to.equal(201);

      // Check if the response data has a 'playbackUrl' property
      expect(response.body).to.have.property('playbackUrl');

      // Verify that the stubbed network request was called with the expected URL
      cy.wait('@livepeerTranscode').its('request.body').should('deep.equal', {
        input: { url: 'http://example.com/test.mp4' },
        // Add other necessary parameters here
      });
    });
  });
});
