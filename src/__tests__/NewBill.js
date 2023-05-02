/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event';
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const title = await screen.getByText("Envoyer une note de frais")
      expect(title).toBeTruthy()
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
      window.onNavigate(ROUTES_PATH.NewBill)
      const ButtonSubmit = await screen.queryByLabelText("Envoyer")

      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const handleClickSubmit = jest.fn((e) => newBill.handleSubmit())
      
      ButtonSubmit.addEventListener('click', handleClickSubmit)
      userEvent.click(ButtonSubmit)
      expect(handleClickSubmit).toHaveBeenCalled()

      //let findText = await waitFor(() => screen.getByText(`Mes notes de frais`) )
      //expect(findText).toBeTruthy()
    })
  })
})
