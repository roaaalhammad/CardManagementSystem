using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CardManagementSystem.Api.Services
{
    public class AuthenticaService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;

        public AuthenticaService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _apiKey = config["Authentica:ApiKey"] ?? string.Empty;
            var baseUrl = config["Authentica:BaseUrl"] ?? "https://api.authentica.sa";
            _http.BaseAddress = new Uri(baseUrl);
        }

        private HttpRequestMessage BuildRequest(HttpMethod method, string path, object? body = null)
        {
            var request = new HttpRequestMessage(method, path);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add("X-Authorization", _apiKey);
            if (body != null)
            {
                var json = JsonSerializer.Serialize(body);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }
            return request;
        }

        public async Task<(bool Success, string Message)> SendOtpAsync(string phone)
        {
            try
            {
                var request = BuildRequest(HttpMethod.Post, "/api/v2/send-otp", new { method = "sms", phone });
                var response = await _http.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return (false, $"تعذر إرسال رمز التحقق: {content}");
                }

                return (true, "تم إرسال رمز التحقق للموظف بنجاح");
            }
            catch (Exception ex)
            {
                return (false, $"تعذر الاتصال بخدمة الرسائل: {ex.Message}");
            }
        }

        public async Task<(bool Verified, string Message)> VerifyOtpAsync(string phone, string code)
        {
            try
            {
                var request = BuildRequest(HttpMethod.Post, "/api/v2/verify-otp", new { phone, otp = code });
                var response = await _http.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return (false, "رمز التحقق غير صحيح أو منتهي الصلاحية");
                }

                using var doc = JsonDocument.Parse(content);
                bool verified = false;
                if (doc.RootElement.TryGetProperty("verified", out var verifiedProp))
                {
                    verified = verifiedProp.ValueKind == JsonValueKind.True;
                }
                else if (doc.RootElement.TryGetProperty("status", out var statusProp))
                {
                    verified = statusProp.ValueKind == JsonValueKind.True;
                }

                return (verified, verified ? "تم التحقق بنجاح" : "رمز التحقق غير صحيح أو منتهي الصلاحية");
            }
            catch (Exception ex)
            {
                return (false, $"تعذر الاتصال بخدمة التحقق: {ex.Message}");
            }
        }
    }
}
