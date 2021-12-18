let timerID;
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function check_Validity() {
    clearTimeout(timerID)
    timerID = setTimeout(() => {
        location.reload();
    }, 15000)
    const success = document.getElementById('success');
    const failure = document.getElementById('failure');
    try {
        const exampleDIDDocument = {
			"id": "did:web:nzcp.identity.health.nz",
			"@context": [
				"https://w3.org/ns/did/v1",
				"https://w3id.org/security/suites/jws-2020/v1"
			],
			"verificationMethod": [
				{
					"id": "did:web:nzcp.identity.health.nz#z12Kf7UQ",
					"controller": "did:web:nzcp.identity.health.nz",
					"type": "JsonWebKey2020",
					"publicKeyJwk": {
						"kty": "EC",
						"crv": "P-256",
						"x": "DQCKJusqMsT0u7CjpmhjVGkHln3A3fS-ayeH4Nu52tc",
						"y": "lxgWzsLtVI8fqZmTPPo9nZ-kzGs7w7XO8-rUU68OxmI"
					}
				}
			],
			"assertionMethod": [
				"did:web:nzcp.identity.health.nz#z12Kf7UQ"
			]
		}
        let qrcode = document.getElementById('qrcode').value;
        qrcode = qrcode.replace(/\s/g, '');
        const result = vop(qrcode, { didDocument: exampleDIDDocument });
        if(result.success == true) {
            const details = document.getElementById('details');
            while (details.firstChild) {
                details.firstChild.remove();
            }
            const name = document.createElement("h3");
            const node = document.createTextNode(result.credentialSubject.givenName + " " + result.credentialSubject.familyName);
            name.appendChild(node);
            details.appendChild(name);
            const age = document.createTextNode(getAge(result.credentialSubject.dob));
            const ageElement = document.createElement("h3");
            ageElement.appendChild(age);
            details.appendChild(ageElement);
            success.classList.add('success');
            failure.classList.remove('failure');
        } else {
            const fdetails = document.getElementById('failureDetails');
            if(fdetails.firstChild) fdetails.firstChild.remove();
            const reason = document.createTextNode(result.violates.description);
            const reasonNode = document.createElement("h3");
            reasonNode.appendChild(reason);
            fdetails.appendChild(reasonNode);
            failure.classList.add('failure');
            success.classList.remove('success');
        }
    } catch (error) {
        const fdetails = document.getElementById('failureDetails');
        if(fdetails.firstChild) fdetails.firstChild.remove();
        const reason = document.createTextNode("Application Error");
        const reasonNode = document.createElement("h3");
        reasonNode.appendChild(reason);
        fdetails.appendChild(reasonNode);
        failure.classList.add('failure');
        success.classList.remove('success');
    }
}