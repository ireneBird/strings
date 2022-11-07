// @ts-nocheck
import { SyncPromise } from './SyncPromise';

const DEFAULT_VALUE = "default"
const DEFAULT_FAIL = 'Houstooooon!'


function syncPromise(value: any = DEFAULT_VALUE, fail: any = false) {
  return new SyncPromise((resolve: (arg0: any) => any, reject: (arg0: string) => any) => {
    fail ? reject(DEFAULT_FAIL) : resolve(value)
  })
}


describe('SyncPromise', () => {
  describe('then', () => {
    it('with no chaining', function () {
      syncPromise().then((v: any) => expect(v).toEqual(DEFAULT_VALUE))
    })

  })

  describe("static methods", () => {
    it("resolve", () => {
      SyncPromise.resolve(DEFAULT_VALUE).then((v: any) =>
        expect(v).toEqual(DEFAULT_VALUE)
      )
    })

    it("reject", () => {
      SyncPromise.reject(DEFAULT_FAIL).catch((v: any) =>
        expect(v).toEqual(DEFAULT_FAIL)
      )
    })


    describe("all", () => {
      it("with success", () => {
        SyncPromise.all([syncPromise({ value: 1 }), syncPromise({ value: 2 })]).then(
          (v: any) => expect(v).toEqual([1, 2])
        )
      })

      it("with fail", () => {
        return Promise.all([syncPromise({ value: 1 }), syncPromise({ fail: true })]).catch(v =>
          expect(v).toEqual(DEFAULT_FAIL)
        )
      })
    })

  })
})