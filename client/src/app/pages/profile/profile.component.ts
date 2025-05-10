import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: { username?: string; email?: string; role?: string } = {};
  isLoading: boolean = false;
  isBrowser: boolean;
  isDarkMode: boolean = false;
  isSidebarVisible = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  profile = {
    avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBEQACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABgQFAQMHAgj/xABIEAABAwMBBQQECgcFCQEAAAABAAIDBAURIQYSMUFRE2FxgRQikbEHFSMyUnKTocHRM0JTYoKS4RY0Y6KyJCY1Q1ZzlPDxJf/EABsBAQACAwEBAAAAAAAAAAAAAAADBQECBAYH/8QAMxEAAgIBAwICCAQHAQAAAAAAAAECAxEEITEFEkFRExQiMlJhgaEVM3GRIzRCscHR8PH/2gAMAwEAAhEDEQA/AO4oAQAgBACAEAIDXLKyJjnyPaxo4lxwEW/BiTUVli/cNsKCmy2DfqX8PU0aPNTx08nyV9vUqobR3Yv1m2Fzn0h7OnZ+6Mu9pU8dPBclfZ1K+Xu4X3KaouFbUk+kVlRJnkZDj2cFIoRXgcc7rZvMpP8AdkbiddVuRGcIAIB4gIGsnqOSSI5hlkiPWN5afuWHFPlGynKPutr9Hgs6XaS702AyrdI36MoDv6/etJUwfgdMNdqIf1ZLyh22O8G11Lgc3xOz9xUEtN8J3VdV8LI/sMtvutFcBmmqGvP0c4cPJQShKPJZVaiu33GTxwWhOCAEAIAQAgBACAEAIAQAgBAeXEAZzogFq87WU1GXQ0QFRONCc+o3xPPyU9dDlyVuo6jCG0N2Jdfcqu4S79ZO6TXRvBo8AF1xhGPBSW6iy1+3Ii8FuRAgBAZQHlzmt+c4DxOFjJsot8Iw17CdHtJ7imUO2S8D0smAQwCAy1zmu3mEtIOQQcFYa8zKbTzkYrPtbVUu7FXZqIuAf+u0ePPzUE9OnvEsdP1GyG1m6+462+4U1whE1LK17efUeK5JRcXhl3VdC2PdF5Jq1JQQAgBACAEAIAQAgMEgcUBqq6iKmgdNO8MjYMuceSyk28I0smoR7pcHP7/tLPcS6CmzFSnTGcOf3noO5d1dCjuyh1WvlbtDaJQKYrwQwGUMghgob5tRQ2rMTQaipH/LacBv1iopWKOyLPSdLt1HtP2Y+fj+wqVO0N7ubiYpOwjPKIboHmonOTPQ6fpOnrXu5fmQnUdXJl09Y7Xjl5K0azuWC00I8JI8ejbh/wCIlp7j/VMGXTDxwTKW6XWjx6NcWygfqOdnPkVspSXDOO7pmmtW8V9Ni/t22bd5sd2pzA48JYxlvmPyUkbvMpNT0SUVml5+T/2NVPPFUQtmglZKx2oew5BUyeSkshOt9s1hmxZNQQwb6KsqKGYT0khY8dODvELWUVJYZJVbOqWYMf8AZ7aKC6DsZQIasDVhOju9q4ranD9C/wBJrY3+y9pF9kdVCd5lACAEAIAQAgBAR6yqhpaZ887wyOMZLispNvCNLJqEXKXCOb369TXeozqynafUj/E9676qlBb8nm9Xq5Xy22iVSlOTYEAICNV1tPSMzUSbvMAauPkhJXVOz3UKF/2ulfvUttYY97QvOrh4KK2ePZRf6DpUX/Et3+QvxU0dOzt612XE5DDrr+K5z0sYqKWTXPcnOy2FoY3rzQw5vwIT5HSHL3uPms4NG2zwmAZTAPYle0Y3iR0J0WMDcZ9i5o6WqdPU1EsUTvmxt+Ye9ynqg+Sj6uu+HZGKb+6/Q6A1zXMD2kFp4EHIU3B5lrDwekNTCAzG58cjXscWuactcDqD3LDSfJspNe6dA2X2hbcWimq3BtW0aHlIOviuK6rseVwX+i1vpl2y5GMHKgLEygBACAEAE4QHlxAaSeSA5ztTejcqrsIXYpYnaAfrnr4Lupr7Vl8nnNfqndLsj7qKIDGe9TnACAEBQXW/tjLoaHDnA4Mh4DwWyiWFGjz7UxWuFU5rHyucXSO0yTqk32xLairukoLYrKbdgj9Mn1cTiMfiuHOdz0FcVCOSHPM6eTeec93RMGG23ua0wDCyYBACAyOHBYYLije6nbG0kOY4LpqltgqtXU4Tz5l3bblUUDvUdvRk6xnh5dFO0Vl1EbVvyN1vroK+HfgOo0cw8WrRoqLapVPDJXPCwRghg9xSSQyMlhcWyMILXDiD1WMJ7M2jJxeV4HSdnLwy60gccCePSRo947iq+2vseD0uk1Kvrz4+JcA5UZ1mUAIAQGDwQCrttdvR4BQQO+VmGZCDq1n9V0UQ7nllX1HUuuPo48sRQMLsKHgFkAdEMivfLyZ3OpqV2Iho544u7vBbqJaabTKPtS5KNbHcVlx+VnbF+8APxXNe/A7tDHM8kKrl7WXA/Rs0aFzFq3kjrY1BACZBnHHXgmRlF/ZNjrxeaZ9RTQBkQbmN0p3e1PRvVc9mprg+1vc2UZNZSKero6ihqn01ZC+GZhw5jxghSxakso0ybqF+/G+AnkXMPQjkpIPDNLo+krcX+pa0snaQMcePBdsXlFG0SqWokpZmywndeOfXxWcZI5wU1iQ52yvir6ffafXbo5vNq0aKW6p1PDJiwQggJtouMlrrmVLNWDR7PpN5haWQ744ZPp7nTYpROp00zJ4mzRODmPAc1w5hVuMbHqYyUl3R4ZtQ2BACA01VQymp5J5ThkbS4nuCyll4NZyUIuTOUXCrkr62WplPrPdnHQch7FZRj2xSR5O212zc2R1sRggKDaO5mMGkp3AOcPlCOOOi2iiw0dGf4kvoLS3LMEyCmrnls5cOILgFyXcljoXjJDbG949RjnY44GcKDbxZYZPTKad/zIZXeDCU7kYyiXS2O61bt2nt1U498RHvWrtguWZWXwhjtnwb3urcDU9lSs57x3nDyC55ayuPG5IqpP5D7s98G9qtpbNUsdWTNOWunHqjwZ+eVyWam2z5I2ShH5jtDBHC0CMDIGNVAlgSk5Cn8JWysd/tElVSxf8A6VKwviI4ytHFh693euii1wkkRSXicMpHYqInNPFw+9Wqe5iOMouLfpG/oCu6HBQSJK3NSRb6yShqWTRnho4dQsNEVtSsj2seKedlRDHLEcseMgqMpJwcJOLNiGgeeEA67B3MuifbpDnsxvRHu5j2+9ceohh9yLvpd/cvRvwG8LmLcygMHgUAq7d1xhooqNp9ed2XfVH9SujTxzLJVdUt7YKteIijRdpRAgI1xqm0VHJUOwd0Ya0/rE8AiRLTU7ZqCEZ73SSOlkO89xJcepUpexSSwjygBDJTXNu7I7pvLluW5YaJ7tHUvgdtTXWOpq5mNxPOQ0kZ0aAPfvKl1jzPHkWtbwsjJfL9szYJRFcapkcx1ETGF7vMN4eahhROfCMu/HJrse2OzV5rmUNBUPNTJksjkhe3OBniRj71memlFZaNVc28JjSGhuN0AY6BRmXvyRLtc6Oz0MtfcJeyp48b790nicDQLMYuT2MN4QtQ/CZstJK1hrZY8nGZKd4HtxopnprUs4NfSIbaaeGqgjmgkZLDIN5j2HIcO5QtNG3J857UUItW1ldSRt3WR1JcwdGn1gPDBVxQ+6KIW+1N+RsoB8m7vJVjBbFFIkrcwCAvdmK4xzGikPqSZMfc7p5rSSOHW090e9eAz+fktSqA6oCXa611ur4aoE7rHgu+rzWk490cEtNvoZqfkdXicHsDhwIyFW8HrE87ntDIHggOZbWVfpd9qQHZbDiJvlx+/PsVhTHEDzOus9Je/lsU6lOMEAsbU1W/UR0zTpGN53iVvEtNDXiLk/Eolsd4IDD3NY0uccAcSjeAaxZLldbVWXWCnDaGkaXyTPO6HY4hv0iPZ3rivugpKL5O3Swkn3eB2b4PqcU2xlrjDd3ehDz4uOSqS95sZax4PdztmzNsp57jc6ajiYTvTTzs3nOcevMlYU5y9lMdsUbbJbNn8tuVnoaVr3Nx2zIixwzywRkHxCTlNbMRw90XSjNzTV0sFZTvp6uFk0LxhzHjIPisp43QYt01JsY64SWymoqA1DXdm5jYDu72M7m9jdLsAndBzoTjQqZu3Hc2R5jwX9sttFaoXQW+BsEJdvdmw+q088DkoZScuTZJI5Ptrs9WX34RKqltrY+19FbP8o7dBxpx68FYUWwqrTmQXQlKMkhYjbJSTzUVXE6GoieWvY7i08//AHgVb1zTWUU04NPc3qU0BAZY90b2vYcOacgozDSawx9o521VPFO39doJ8VEUNkHCbTNyEYFDJ0rY6r9LsUG87L4sxO8uH3YVfdHtmz0nT7O+hZ5WxdqI7TxK8RxPkdwa0k+Syt2Yk+1NnH5XmWaSUnJe4uJ8TlWa2SR4+Ty2/Ns8rJgCcDJ5IZW7EKtm9Iq5Zc53nkjwUiL+qPbBI0LJuCAi3EkU5xxytZm0eTtlDRQDY+joYADTyUgZ3EObqfNeZtsatcvmeg00F2Y+RP2bhNPYLdA/O9FA1hz3aLSbzJsyljYjbX7Ow7TWc0EszocOEjJBrhw6jmtqrPRyyYlHJv2ftT7RQ9hPWzVtQ529LPMfWccAD2AALFk3N5EY9qwT5phEQDxKjbwSxi5G1pBwRqFlM1FKg2KbSX+S4x3KqFJJU+lehZ9UyjOCeuMroeobh2kXo98jY3HDODhc5IL8Vvki2prLmQQZo4oGd4bkn3racn2KJtXFZkzn/wAK8cUe1tM+LAllp2mTyJAJ8vcrjp7fo/qVGtS79vIXVZnACAEA0bKT79LLAeMb8jwK0kir18MTUvMvFqcAIBx+D2f++U+cD1XgfcfwXJqVumXPSp7Tj9RzHDVcpckC+S9lZ6x+TpE4fgtoL2kQah9tMn8jlLeCszyhlARrnL2NvqZBoRG7HjjRCWlZsSETAHDgpS+BACA1zx9pEW5weSxJZMpjlsLtxTUFAyz34ubHB6tPPuZAbya7w5HoqjV6JyfdAstNqlFYkdHs90obtSGe2zsmga/c3hyI5KtsrlCXbI742RmsxZNWhuZ4oCLVQOlflvgtHHJJXNJYJEbAyNoBzgarZcGj5PSyYMEc/uTbxArXnbqwWuSdrpnVFVA4s7GIEneHEZ4DxXVXo7ZtN7I5Z6uEFg5NW19TfLtPda8jtJCN1oOjGjg0dw95J5q7pqVcVFFVbY7HlgughBACAudlpN24vZykiPtBH9VrI49dHNWfJjWtCoBAMWwsu5enN5PhcPZqufUr2Cy6W8XY+R0JvBcR6AqNqjjZ+s+qPeFJT+Yjk1zxp5nMlYnmAQFdtC7dtE/fuj/MFlcnTo/zo/8AeAmcRlSFyCGQQAgPEkccgw9qw0mZTwMPwa3v4mv0lvqXbtHWkAOdoGyj5p8x6vjuqt11PdHuXK/sduju7ZYfDOyqlLcMZ0QMgOu9LHNJFP2sMjHEevGcHvB5rODb0b5Rvo6ptYwyRskDQcB0jC3e7wDyRrBhxcdmSFgwUm198Zs/Y56zLTORuU7D+tIeHkOJ7gp9PU7ZqPgQ32KuGThlNEXjtpwZHvJcS7iSeJ9q9FGKSKKUsvcl8lIaggBACAsNn3Yu9MO93+krV8HNqvyZf94jplaFMCGC72NP+8EP1H+5Q3+4d3Tv5hfU6SFwHpCo2rGdn63H0R7wpKvfRya3+XmcyVieYBDJXbRDNnqAP3T/AJgsrk6dJ+dH/vATApC5BACAEAIDTUw9qMtOHt4FayWTaLOj7BbdR1TY7Ve5RFWNAbDO84bMPono73/cqXVaNxfdAtNPqk1ibOg5Vcd+QzpogBAQ7vdaKzUL624ziGBnPm49Gjme5b11ysl2xNJ2Rgss4ntJfanam6+kzNdHRxHEEOc7je/vKv8ATaeNccFNfe7Hki8NMYx0XWcwIAQAgBAWFgGbxT/xf6StXwc+q/JkOgC0KUEMF3saP94IPqP9yhv/ACzu6d/MI6SFwHpCBfIjLaKxmM5icfZqtoPEkQamPdTJfI5S3grM8ojKAi3WMy22pYBkmMkDwGVlck1DxbERdOXBSF6CAEAIAQAgIN0ADA7GuDqOajmt8G0T6AgqZImsa8F3qjTpovJ92Hg9T2KSyiSKyLHrFwKz3o09FI8Prm4wxpPeVjuNlV5nNPhckfJ8VB+T60uf8is+mPeX0/yV3U12qKXz/wACi1rWtAYMN5K9SwUxlACAEAIAQFvsvFv3Nz8aRxk58dPzWr4OPXPFWPMbVoVAZQDHsJFv3l7yNI4ifaQFz6h+zgsulrNzfyOghcR6AxIwSRuY75rgQUTwYaysHH6iN0FRJC4YdG8sd5FWi4TPITWJtfqeFk1BwBGDwKGU8biBVwmnqpYTpuOIHgpE9i/rkpQTNSybggBACA8SSsiGXlYbwEsnijpXXScuky2nZ9/cuPUX9ix4lloNG9RPL91cnaLVtFbrjAyOqLYJwMFrzgHwKoZQ8S6nTKp7cFu2khkbvxuJafouBC07DT0kkaKmS30TS+qqGswODnjPs4oomylZLZHOPhAq49oDAKFm42j3uzzxk3sZ8Pmqw0c1U8PxItXoJ2V5T9pCXDUj5k3qvGmqu4zTR5yUJJvKJJW+TQEAIAQB4IBn2Ug3IJpv2jsA9w/+rSRV6+XtqPkXq1OAygHL4Paf5KsqccS1jT9594XJqXukXXSoezKX0HEZxquUuAPBAc32ypDS3yR4bhk7RIPHgfv18130SzA831Cvsvb8yjUxwggFfamm7OqZUNGkgw7xC3j5Ftop90XFlGtjtBAeJJWRj1nDPQLDaRlJs107ay4v7Ojic4czjh5qKdyjyTVUTseIrJfW/ZaFjt+4SGY/s26DzK45ahvgtaunRTzN5LaahjYB6OxjGgY3WtwMeC45x7ty3olGEe1LCIW6WnBByCocHWmmjbTxufv4cRgZ05rMVkjm0nwaiMkZ4hYJMeRthhfK7dAw3mVlJvk1nNRW57rrDRVjCHxlkuP0rDr59V112ShsuCp1GmrveZc+Ys1tluFszJF8tCOLmjOPEcl216hSeCov0VlfG6IsNWx+N/1Ceq6VI4u1+BIWxqCAyxrnvaxoy5xAARvBhvCbY+UMDaWkigbj1W6955qNvJQ2T75ORvWCMCcDPLmg28Tp2ytGaKx08bm7r3jtH+LtfdgeSrrZd02z0+hqddCT55LdRnWYPAoBa23oDU20VLG5fTnP8J4/gp9PLEsFb1Knvq71yhAGF3HnwQEW6UYrqKSA43jrGTydyRcktNvo5qQjPa5j3NeMOa7Dh0KlL5NNZRFlmkfL2NON550JUVk1FZZJXXKbxHkuLNs9E+XfrnGRwGezB0Hiear5aru2Rdw6Wq4qVry/IaIoY4YxHFG1jBwa0YChy3ydsYqKxHY2IZDksA1ywxyj1h5hYcUzeM3Hg8wQNha5oJIceaKOBObk8nhtFEHEuycngsdiN3dIkNAa3dAw3oFsiJvPILJgzzB6ICouez9FXb0jW9hPx34xx8RwUkLZROS7RV27rZilPFUW1+68F0Z4O5FdtWoU1lFVqtJZQ/a48zdFI2Rm83z7l0p5RxNF9sxQmWo9KkGY4tGZ5u6+SxJnDrre2Po14jStCqBATrHRG43SCnxlm9l/1Rx/JaWT7Y5OjTVemtUfDxOqsGGgBVp6o9IAQHiWJksbo5BvNcCCDzCZwYaTWGcqvNA+23OameNAd6M9WngfwVjXLujk8rqKXTY4fUhKQgAjPFAK22FKIG+mx6F/quHPPVZzsWmhtbXY/ArrBSCOm9IeAXyZwe5VWqtcpdq4PbdK00YV+la3f9hhtw+Vd9X8lzwLDUe6WClOYEMAgBACAEABrnHDQSegGUD2WTZ2E2f0Mn8pQx3R8w9Hm/YyfylB3LzNcjXR53mlpA1BCMynndFFLGyWMskaHNPIqCLaeVyd84Rsj2yWUL9NbpBfGUcbsNecku+irnT2d8VI8Z1CtaSU14Lg6DTQR00TYom4a0YCle55acnNts2oaAe5APew1s7CjNdK3D5wNzuYPzK4r55eEX3TKOyHpH4jUuctAQAgMHggF/ayz/GNF2sA/wBogBLcD5zebVNTZ2P5HBr9N6avK5RzvB5jHXPJd55z9QQyLW1zjv07eW644W0OSx0K9mTPMDGxQRxsGGtaAAqGbzJs+l0x7aoxXkidbf0rvD8khyaX8IsFKcwIYBACAEAICbZ7pPaKs1NMGF5YWYeMjBI/JZRHbVGyOJF3/bq5fsqb71kg9Sh5mP7dXL9nTewoPUoeZS3q6z3eY1NQIw5rN0bjdAFqzopqVeyFdc5aFbVEx3SKRmj/AFNfNW+hX8H6s8n1xZ1Dz8P+x1H4LoPFmScIYLKwWp11rxE4EQM9aVw+j08SorbOxHXpNO77MeCOoRtDWhrQA0DAA5Kv53PTpJLCPaAEAIAQGCNEAj7YWHsXOuNIw9m4/LMH6p+kF10W/wBLKTX6Np+kh48inyyuoqELG1v6aD/tuW0Sy0XuTPTfmjwXn3yz6dHhEy3fpXfV/FbQ5ItRwiwUpyggBACAEAICfZa2noKwzVVIyqZuFoY8A4OmuvgfaskVtcprEXgvP7UWkafEFP8AyM/JMnM9LZ8Yf2ptP/T9P/Iz8kMerWfH/cor/X09wmM1LRx0jRHjdYAMnyWsuDrorcOXkVlAWpWV39/j/h95VxofyfqzyfW/5h/ov8js3kpzxLJFFRz19THTU7d6V58h3laykorLJK6pWz7YnTrNbIbXRsp4hk8XvPFx6qvnNyeT0+nojTDsRPwtCcygBACAEAIDw9rXNLXNBB0II4rJhrKwIO0+zbqIuq6FhdTnV0Y4s8O5dlV2fZkUOs0LrffXwc32qilkmp3MjLmlpGWjONV1pmNDJdrT2Kr0ms4Bj8DT9GVzvR0vfH3PQrq+pSx3r7GyKuuEZzG1wPfEi0lK/wDTWXVdRLmS+xt+Nbp0P2K29Wq8vua/iV3xL7B8aXTo77FPVqvL7mPxK74kHxpdOjvsU9Wq8vuPxK74kHxrdejvsP6J6rV5fcfiV3xIBdLp0d9h/RPVqvL7j8Su+JB8aXTo77FPVqvL7j8Su+JB8aXT6LvsU9Wq8vuPxK74kHxrdejvsU9Wq8vuZXUrviQfGt16O+xT1ary+4/Er/iQG53MhwIdr/grD0tT/wDR+J3p57kaBUVv0HfZLX1Ojy+5J+Man4l9jw1lTUVLHGJznFwHzCMaqeFcao4icOq1Urm52Pf6HQaCjnrqhlNTsLpHDpo3x7lrKSiss8/VVK2XZBbnR7DZYLTButAfM758nXu8FX2WOb3PRaXSw08duXyW+AozrBACAEAIAQAgBAeXDIwRoe5AKG0GyW+X1NqaN46ugJwD3t7+5dNd+NpFRqundz76/wBhNkidE8xyMLXN4hwwV1p5KZqUXiR5wOgWTGQwOiAMDogDA6IAwgDCAMBAGB0QBgIAwOiAMDogDA6ICzs1jq7pJmJvZw85iNPLqVFO1QOrT6S257LbzOhWm1U1rg7OnZqfnyO+c8964ZTc3lnoKNPCiPbEsFqTggBACAEAIAQAgBACAweKArbrZaO6NxURYeOEjdHBbwslDg579LVcvbQlXTZa4URc6FvpUI5sHrAd7fyXXC+L5KS/p9te8d18iiOW6OBB5g6Kc4WsPDMoYMIAQAgBAZQGO5ACAk0NurLhKGUdO6Tq7Gg8TwWspxjyTVU2WvEEN1o2OjhxJcnCZ/Hs2Z3R4nmuSeob2iW+n6ZGPtWPL8vAaoo2xMaxjd1o0AA0CgbyWkUorCNiwZBACAEAIAQAgBACAEAIAQAgPJGvBAQq+0UNwH+007C76YGHe1bxslHggs09dnvIXqzYeN2tFVOj/dkG8FNHUtcnBZ0qL9yWCnqdkbvDksjjmH+G/B9hwpVfBnFPp2ojws/UgS2W6xfPt9R/Cze9y3VsH4kD0l65gzQbfXNODQVf/jv/ACW3fHzI3Tav6H+z/wBHtlruL/m2+q84XD3hYdkV4my09z/of7EyDZq8THSic0dXuDfxytXdWvEljodRL+ks6bYmreQampjjbzDBvFRvUrwR1w6XY/fl+xeUOyVspiHSRuneOch09ihlfOR219Ophzv+pdxRNjaGMY1jRwa0YAUTO6KSWEjaOCwZBACAEAIAQAgBAf/Z',
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    phone: '',
    address: '',
  };

  private selectedFile : File | null = null;
  private apiUrl = 'http://localhost:8000/api/users/current';
  private updateApiUrl = 'http://localhost:8000/api/users/userInformation';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.isLoading = true;
    if (this.isBrowser) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/auth']);
        this.isLoading = false;
        return;
      }
      this.user = {
        username: localStorage.getItem('username') || 'Guest',
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || 'user',
      };
      this.profile.email = this.user.email || '';
      this.fetchUserProfile();
    } else {
      this.user = { username: 'Guest', email: '', role: '' };
      this.isLoading = false;
    }
  }

  isFullUrl(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://') || false;
  }

  private fetchUserProfile() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.user = { username: 'Guest', email: '', role: '' };
      this.isLoading = false;
      this.router.navigate(['/auth']);
      return;
    }

    // Gọi endpoint GET /api/users/current
    this.http
      .get(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          // Sửa lại: Truy cập trực tiếp response thay vì response.user
          this.user = {
            username: response.username || response.email || 'Guest',
            email: response.email || '',
            role: response.role || 'user',
          };
          this.profile = {
            avatar: response.avatar || this.profile.avatar,
            firstName: response.firstname || '',
            lastName: response.lastname || '',
            birthday: response.birthday || '',
            email: response.email || '',
            phone: response.phonenumber || '',
            address: response.address || '',
          };
          if (this.isBrowser) {
            localStorage.setItem('username', this.user.username || 'Guest');
            localStorage.setItem('email', this.user.email || '');
            localStorage.setItem('role', this.user.role || 'user');
          }
          // console.log('User profile:', this.user);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          this.errorMessage = 'Không thể lấy thông tin người dùng. Vui lòng thử lại.';
          this.isLoading = false;
          this.router.navigate(['/auth']);
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onUpload() {
    if (!this.isBrowser) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profile.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onDelete() {
    this.profile.avatar = 'https://via.placeholder.com/100';
    this.selectedFile = null;
  }

  onSave() {
    if (!this.isBrowser) return;

    // Kiểm tra các trường bắt buộc
    if (!this.profile.firstName || !this.profile.lastName) {
      this.errorMessage = 'Vui lòng điền đầy đủ First Name và Last Name.';
      this.successMessage = null;
      return;
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      this.errorMessage = 'Không tìm thấy token. Vui lòng đăng nhập lại.';
      this.router.navigate(['/auth']);
      return;
    }

    const decodedToken = this.authService.decodeToken(token);
    const userId = decodedToken?.user?.id || null;
    if (!userId) {
      this.errorMessage = 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.';
      return;
    }

    const userInformation = {
      firstname: this.profile.firstName,
      lastname: this.profile.lastName,
      birthday: this.profile.birthday || null,
      phonenumber: this.profile.phone || null,
      address: this.profile.address || null,
      avatar: this.profile.avatar || null,
    };

    const formData = new FormData();
    formData.append('userInformation', JSON.stringify(userInformation));
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.isLoading = true;
    this.http
      .post(this.updateApiUrl, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message || 'Thông tin đã được lưu thành công!';
          this.errorMessage = null;
          console.log('Lưu thông tin thành công:', response);

          if (response.avatar) {
            this.profile.avatar = response.avatar;
            this.selectedFile = null;
          }

          this.fetchUserProfile();
        },
        error: (error) => {
          const errorMsg =
            error.status === 404
              ? 'Không tìm thấy endpoint. Vui lòng kiểm tra backend.'
              : error.status === 400
                ? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
                : error.status === 500
                  ? 'Lỗi server. Vui lòng thử lại sau.'
                  : error.error?.message || 'Lưu thông tin thất bại. Vui lòng thử lại.';
          this.errorMessage = errorMsg;
          this.successMessage = null;
          console.error('Lỗi khi lưu thông tin:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
