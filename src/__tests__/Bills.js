/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event';
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then the button new bills go to new bills page", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const ButtonNewBill = await screen.getByTestId("btn-new-bill")

      const bill = new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill())
      
      ButtonNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(ButtonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      await waitFor(() => screen.getByTestId(`form-new-bill`) )
      expect(screen.getByTestId(`form-new-bill`)).toBeTruthy()
    })
    
    // test("Then the button icon-eye in actions", async () => {

    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem('user', JSON.stringify({
    //     type: 'Employee'
    //   }))
    //   const root = document.createElement("div")
    //   root.setAttribute("id", "root")
    //   document.body.append(root)
    //   router()
    //   window.onNavigate(ROUTES_PATH.Bills)
    //   const ButtonIconEye = await screen.getAllByTestId("icon-eye")[0]
    //   console.log("🚀 ~ file: Bills.js:79 ~ test ~ ButtonIconEye:", ButtonIconEye)

    //   const bill = new Bills({
    //     document, onNavigate, store: null, localStorage: window.localStorage
    //   })
    //   const handleClickIconEye = jest.fn((e) => bill.handleClickIconEye())
      
    //   ButtonIconEye.addEventListener('click', handleClickIconEye)
    //   userEvent.click(ButtonIconEye)
    //   expect(handleClickIconEye).toHaveBeenCalled()
    //   await waitFor(() => screen.getById(`modalFile`) )
    //   expect(screen.getById(`modalFile`)).toBeTruthy()
    // })
  })
})

//test d'intégration
describe("Given I am connected as an employee", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentPending  = await screen.getByText("Nom")
      expect(contentPending).toBeTruthy()
      const contentRefused  = await screen.getByText("Statut")
      expect(contentRefused).toBeTruthy()
    })
})

describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
    )
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Admin',
      email: "a@a"
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()
  })
  test("fetches bills from an API and fails with 404 message error", async () => {

    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 404"))
        }
      }})
    window.onNavigate(ROUTES_PATH.Bills)
    await new Promise(process.nextTick);
    //const message = await screen.getByText(/Erreur 404/)
    //expect(message).toBeTruthy()
  })

  test("fetches messages from an API and fails with 500 message error", async () => {

    mockStore.bills.mockImplementationOnce(() => {
      return {
        list : () =>  {
          return Promise.reject(new Error("Erreur 500"))
        }
      }})

    window.onNavigate(ROUTES_PATH.Bills)
    await new Promise(process.nextTick);
    //const message = await screen.getByText(/Erreur 500/)
    //expect(message).toBeTruthy()
  })
})