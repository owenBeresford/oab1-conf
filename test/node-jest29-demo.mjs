"use strict";
import jest from "jest";

//this is for node18 ans jest28 
// there are too many docs for jest26 etc which is *different*
// and v28 is a BC break.

export function delay(ms) {
  return new Promise((good, bad) => setTimeout(good, ms));
}

export function delay2(ms) {
  return new Promise((good, bad) => {setTimeout(()=>{ return good(true); }, ms)} );
}


test('tests assertions can have delays', async () => {
  await expect( delay2(1500) ).resolves.toEqual(true);
});

test('tests assertions can be counted', async () => {
  expect.assertions(2);
  let ret=await delay2(1500);
  expect( ret ).toEqual(true);
  expect( ret ).toEqual(true);
//  expect( (new Promise("help")).resolve()  ).resolve.toEqual("help");
});

test('tests assertions can use pre-Node8 approach', (done) => {
  delay2(1500).
	then((a) => {
		expect( a ).toEqual(true);
		done();
  })
});

test('tests assertions can be counted', async () => {
  expect.assertions(2);
  let ret=await delay2(1500);
  expect( ret ).toEqual(true);
  expect( new Promise("help") ).resolve.toEqual("help");
});





